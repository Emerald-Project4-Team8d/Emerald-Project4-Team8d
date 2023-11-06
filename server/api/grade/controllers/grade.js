'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async find(ctx) {
        /*
        const {students, classroom} = ctx.request.body

        if (students) {
            return await Promise.all(students.map(student => {
                // validate the request
                if (typeof student.name !== "string" || !student.name) return ctx.badRequest(
                    'A name must be provided!',
                    {id: 'Student.create.body.invalid', error: 'ValidationError'}
                )

                return strapi.services.student.create({
                    name: student.name,
                    character: student.character,
                    classroom: classroom
                })
            }))
        }

        // validate the request
        const {name} = ctx.request.body
        if (typeof name !== "string" || !name) return ctx.badRequest(
            'A name must be provided!',
            {id: 'Student.create.body.invalid', error: 'ValidationError'}
        )

        return strapi.services.student.create(ctx.request.body)
        */
        return ctx.badRequest(
            'Seeing if my change is reflected',
            {id: 'Grade.find.body.invalid', error: 'ValidationError'}
        )
    }
};
