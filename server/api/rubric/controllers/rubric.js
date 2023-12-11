// In rubric.js controller

module.exports = {
    async create(ctx) {
      const { TotalPoints, rubric_rows } = ctx.request.body;
  
      // Create rubric
      const rubric = await strapi.services.rubric.create({ TotalPoints });
  
      // Iterate over rubric rows and create each
      for (let row of rubric_rows) {
        const { CategoryName, PossiblePoints, rubric_entries } = row;
        const rubricRow = await strapi.services['rubric-row'].create({
          CategoryName,
          PossiblePoints,
          rubric: rubric.id  // Associate with the created rubric
        });
  
        // Create entries for each row
        for (let entry of rubric_entries) {
          await strapi.services['rubric-entry'].create({
            ...entry,
            rubricRow: rubricRow.id  // Associate with the created rubric row
          });
        }
      }
  
      return rubric;
    }
  };
  