
// Controller.init()
/**
 * @typedef {import('./viewBase.js').default} View
 * @typedef {import('./service.js').default} Service
 */
export default class Controller {
    /** @type {View} */
    #view

    /** @type {Service} */
    #service

    /** @param { {view: View, service: Service} } deps */
    constructor({ view, service }) {
        this.#view = view
        this.#service = service
    }

    static async init(deps) {
        const controller = new Controller(deps)
        await controller.#init()
        return controller
    }

    #isValid(data) {
        return data.name && data.age && data.email
    }

    async #onSubmit({ name, age, email }) {
        if (!this.#isValid({ name, age, email })) {
            this.#view.notify({ msg: 'Please, fill out all the fields.' })
            return
        }
        this.#view.addRow({ name, age, email })
        this.#view.resetForm()
        try {
            await this.#service.createUser({ name, age, email })
        } catch (error) {
            this.#view.notify({ msg: 'server is not available!' })
        }

    }

    #onClear() {

    }

    async #getUsersFromAPI() {
        try {
            const result = await this.#service.getUsers()
            return result
        } catch (error) {
            this.#view.notify({ msg: 'server is not available!' })
            return []
        }
    }

    async #init() {
        this.#view.configureFormSubmit(this.#onSubmit.bind(this))
        this.#view.configureFormClear(this.#onClear.bind(this))

        const data = await this.#getUsersFromAPI()
        const initialData = [
            { name: 'Lilly Potter', age: 28, email: 'Lilly@lilly.com' },
            { name: 'Daisy Dirt', age: 24, email: 'daisy@daisy.com' },
            { name: 'Tulip Shade', age: 24, email: 'tulip@tulip.com' },
            ...data,
        ]

        this.#view.render(initialData)
    }


}