import './style.css'
import { UsersPage } from './users/users'


document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <section>
      <div id='js-users-page'></div>
    </section>
  </div>
`

UsersPage({
  rootEl: document.querySelector('#js-users-page')!
})

