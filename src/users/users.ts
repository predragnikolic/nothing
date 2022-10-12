type User = {
	id: number
	name: string
	age: number
}

type Actions =
	| { action: 'addUser', payload: Pick<User, 'name' | 'age'> }
	| { action: 'removeUser', payload: number }
	| { action: 'editUser', payload: number }

type Props = {
	rootEl: HTMLElement
}
export function UsersPage({rootEl}: Props) {
	let id = 0
	let users: User[] = []

	const addUser = (newUser: User) => {
		if (!newUser) return
		users.push(newUser)
		render()
	}

	const removeUser = (userId: number) => {
		users = users.filter(user => user.id !== userId)
		render()
	}

	const editUser = (userId: number) => {
		const user = users.find(user => user.id === userId)
		if (!user) return
		user.name = user.name + " (Edited)"
		render()
	}

	listenOn<Actions>(rootEl, 'click', ({action, payload }) => {
		if (action === 'addUser') addUser({
			id: ++id,
			age: payload.age,
			name: payload.name
		})

		if (action === 'removeUser') removeUser(payload)
		if (action === 'editUser') editUser(payload)
	})

	const render = () => {
		const html = `<div>
			<button data-action="addUser" data-payload="${encode({ name: 'Predrag', age: 23 })}">Add user</button>

			${users.length === 0 ? "No users" : ""}

			${users.map(user => `<div>
				${user.name} - ${user.age}
				<button data-action="removeUser" data-payload="${user.id}">Remove</button>
				<button data-action="editUser" data-payload="${user.id}">Edit</button>
			</div>`).join('')}
		</div>`
		rootEl.innerHTML = html
	}

	// first render
	render()
}


type Event = { action: string, payload: unknown}
function listenOn<T extends Event>(el: HTMLElement, event: keyof HTMLElementEventMap, cb: (event: T) => void) {
	el.addEventListener(event, (e) => {
		const clickedElement = e.target
		if (!(clickedElement instanceof HTMLElement)) return
		const action = clickedElement.dataset.action
		const payload: unknown = clickedElement.dataset.payload ? decode(clickedElement.dataset.payload) : undefined
		if (action) {
			const event = {
				action,
				payload
			} as T
			cb(event)
		}
	})
}

function encode(val: unknown) { return encodeURIComponent(JSON.stringify(val)) }
function decode(val: string) { return JSON.parse(decodeURIComponent(val)) }

