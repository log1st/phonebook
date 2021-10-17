import { ApiContext } from 'app/src-ssr/middlewares/api';
import { Router } from 'express';
import { Department } from 'src/models/Department';
import { DepartmentPerson, Person } from 'src/models/Person';
import {
  CreateDepartmentPayload,
  FetchDepartmentsPayload, UpdateDepartmentPayload,
} from 'src/hooks/useDepartments';

function listToTree(list: Array<Department>) {
  const map = {} as {
    [key in Department['id']]: number
  }; let node; const roots = []; let
    i;

  for (i = 0; i < list.length; i += 1) {
    map[list[i].id] = i;
    list[i].children = [];
  }

  for (i = 0; i < list.length; i += 1) {
    node = list[i];
    if (node.parentId !== null) {
      if (!list[map[node.parentId]]) {
        list[map[node.parentId]].children = [];
      }
      list[map[node.parentId]].children?.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

function findNode(id: Department['id'], currentNode: Department): Department | null {
  let i;
  let currentChild;
  let result;

  if (id === currentNode.id) {
    return currentNode;
  }

  if (!currentNode.children) {
    return null;
  }
  for (i = 0; i < currentNode.children.length; i += 1) {
    currentChild = currentNode.children[i];

    result = findNode(id, currentChild);

    if (result !== null) {
      return result;
    }
  }

  return null;
}

export default ({
  dbConnection,
}: ApiContext) => (router: Router) => {
  router.get('/departments', async (req, res) => {
    const query = dbConnection.table<Department>('departments').orderBy('order');
    const { parentId, tree } = req.query as FetchDepartmentsPayload;

    const departments = await query;
    const response = tree ? (
      parentId ? (findNode(+parentId, {
        children: listToTree(departments),
      } as Department)?.children || []) : listToTree(departments)
    ) : departments;

    res.status(200).send({
      departments: response,
    });
  });

  router.get('/departments/:id', async (req, res) => {
    const department = await dbConnection.table<Department>('departments').where({
      id: +req.params.id,
    }).first();

    if (!department) {
      res.status(404).send({
        message: 'Департамент не найден',
      });
      return;
    }
    res.status(200).send(department);
  });

  router.get('/departments/:id/persons', async (req, res) => {
    const personsQuery = dbConnection
      .table<DepartmentPerson>('departmentsPersons')
      .select<Array<Person>>(['position', 'order', 'persons.*'])
      .join('persons', 'persons.id', 'departmentsPersons.personId')
      .where({
        departmentId: +req.params.id,
      })
      .groupBy('departmentsPersons.personId')
      .orderBy('departmentsPersons.order');

    /*
    const contacts = await dbConnection
      .table('contacts')
      .whereIn('personId',
        personsQuery
          .clone().clearSelect()
          .clearGroup().groupBy('departmentsPersons.personId')
          .select('persons.id'))
      .select<Array<Contact>>();

    const contactsMap = contacts.reduce((acc, cur) => ({
      ...acc,
      [cur.personId]: [
        ...acc[cur.personId] || [],
        cur,
      ],
    }), {} as {
      // eslint-disable-next-line no-unused-vars
      [key in Person['id']]: Array<Contact>
    }); */

    res.status(200).send({
      persons: (await personsQuery)/* .map((person) => ({
        ...person,
        contacts: contactsMap[person.id] || [],
      })) */,
    });
  });

  router.get('/departments/:departmentId/persons/:personId', async (req, res) => {
    const person = await dbConnection
      .table('departmentsPersons')
      .select(['position', 'order', 'persons.*'])
      .join('persons', 'persons.id', 'departmentsPersons.personId')
      .where({
        departmentId: +req.params.departmentId,
        personId: +req.params.personId,
      })
      .first<DepartmentPerson>();

    if (!person) {
      res.status(404).send({
        message: 'Контакт не найден',
      });
      return;
    }

    res.status(200).send({
      ...person,
      contacts: await dbConnection.where({
        personId: person.id,
      }).from('contacts'),
      departments: await dbConnection.table('departmentsPersons')
        .select(['position', 'departments.*'])
        .where({
          personId: person.id,
        }).join('departments', 'departments.id', 'departmentsPersons.departmentId'),
    });
  });

  router.post('/departments', async (req, res) => {
    const { parentId, name } = req.body as CreateDepartmentPayload;

    if (!name) {
      res.status(400).send({
        name: 'Название не должно быть пустым',
      });
      return;
    }

    if ((parentId !== null) && !(await dbConnection.table('departments').where({ id: parentId }).first())) {
      res.status(400).send({
        parentId: 'Департамент не найден',
      });
      return;
    }

    const order = await dbConnection.table('departments').where({ parentId }).max({
      max: 'order',
    }).first();
    await dbConnection.table('departments').insert({
      name,
      parentId,
      order: +(order?.max || 0) + 1,
    });

    res.status(200).send({
      message: 'Департамент успешно создан',
    });
  });

  router.patch('/departments/:id', async (req, res) => {
    const { parentId, name } = req.body as UpdateDepartmentPayload['model'];

    if (!name) {
      res.status(400).send({
        name: 'Название не должно быть пустым',
      });
      return;
    }

    if ((parentId !== null) && !(await dbConnection.table('departments').where({ id: parentId }).first())) {
      res.status(400).send({
        parentId: 'Департамент не найден',
      });
      return;
    }

    await dbConnection.table('departments').where({
      id: +req.params.id,
    }).update({
      name,
      parentId,
    });

    res.status(200).send({
      message: 'Департамент успешно обновлён',
    });
  });

  router.delete('/departments/:id', async (req, res) => {
    const department = await dbConnection.table<Department>('departments').where({
      id: +req.params.id,
    }).first();

    if (!department) {
      res.status(404).send({
        name: 'Департамент не найден',
      });
      return;
    }

    await dbConnection.table('departments').where({
      parentId: department.id,
    }).update({
      parentId: department.parentId,
    });

    if (department.parentId) {
      await dbConnection.table('departmentsPersons').where({
        departmentId: department.id,
      }).update({
        departmentId: department.parentId,
      });
    } else {
      await dbConnection.table('departmentsPersons').where({
        departmentId: department.id,
      }).delete();
    }

    await dbConnection.table('departments').where({
      id: department.id,
    }).delete();

    res.status(200).send({
      message: 'Департамент успешно удалён',
    });
  });
};
