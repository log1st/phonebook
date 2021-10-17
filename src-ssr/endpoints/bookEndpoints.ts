import { ApiContext } from 'app/src-ssr/middlewares/api';
import { Router } from 'express';
import { Department } from 'src/models/Department';
import { DepartmentPerson, Person } from 'src/models/Person';
import { FetchDepartmentPersonsPayload, FetchDepartmentsPayload } from 'src/hooks/useDepartments';

export default ({
  dbConnection,
}: ApiContext) => (router: Router) => {
  router.get('/departments', async (req, res) => {
    const query = dbConnection.table<Department>('departments').orderBy('order');
    const { parentId } = (req.query || {}) as FetchDepartmentsPayload;
    if (parentId) {
      query.where('parentId', '=', parentId);
    }
    res.status(200).send({
      departments: await query,
    });
  });

  router.get('/departments/:id', async (req, res) => {
    const department = await dbConnection.table<Department>('departments').where({
      id: +req.params.id,
    }).first();

    if (!department) {
      return res.status(404).send({
        message: 'Департамент не найден',
      });
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
      return res.status(404).send({
        message: 'Контакт не найден',
      });
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
};
