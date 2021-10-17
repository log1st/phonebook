exports.seed = async function (knex) {
  await knex('departments').truncate();
  await knex('persons').truncate();
  await knex('departmentsPersons').truncate();
  await knex('contacts').truncate();

  await knex('departments').insert(Array(16).fill(null).map((_, i) => ({
    name: `Департамент #${i}`,
    order: i + 1,
    parentId: Math.random() > .7 ? (Math.floor(Math.random() * i) + 1) : null
  })));

  const ids = await knex('departments').select(['id']);
  for(let {id} of ids) {
    await knex('persons').insert(Array(5).fill(null).map((_, i) => ({
      firstName: `Имя #${i * id + 1}`,
      lastName: `Фамилия #${i * id + 1}`,
      middleName: `Отчество #${i * id + 1}`,
      photoUrl: `https://picsum.photos/200/300?random=${i * id + 1}`,
    })));

    const subIds = await knex('persons').select(['id']).whereNotIn(
      'id',
      knex('departmentsPersons').select('personId')
    );

    await knex('departmentsPersons').insert(subIds.map(({id: subId}, i) => ({
      departmentId: id,
      personId: subId,
      position: `Должность #${i + 1}`,
      order: i + 1,
    })))
  }

  await knex('contacts').insert(
    (await knex('persons').select(['id'])).reduce((acc, cur, index) => ([
      ...acc,
      ...Array(3).fill(null).map((_, i) => ({
        personId: cur.id,
        type: ['phone', 'email', 'address'][i],
        label: ['Личный', 'Рабочий', null][i],
        value: [`7800555353${index + 1}`, `admin${index + 1}@example.com`, `Улица Пушкина, дом ${index + 1}`][i],
      })),
    ]), [])
  );
};
