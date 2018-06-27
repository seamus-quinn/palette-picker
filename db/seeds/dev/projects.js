
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => {
      return Promise.all([
        knex('projects').insert({
          name: 'Garbage Project'
        }, 'id')
        .then(project => {
          return knex('palettes').insert([
            {
              name: 'Garbage Palette',
              color1: '#1438ab',
              color2: '#56888b',
              color3: '#afaf78',
              color4: '#89b9a3',
              color5: '#cb382a',
              project_id: project[0]
            },
            {
              name: 'Trash Palette',
              color1: '#1438ab',
              color2: '#56888b',
              color3: '#afaf78',
              color4: '#89b9a3',
              color5: '#cb382a',
              project_id: project[0]
            }
          ])
        })
        .then(() => console.log('Seeding complete'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
