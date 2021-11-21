<script>
import { onMount } from "svelte"
import { setCurrentUser } from "./store/users"
import { Route, Router } from "svelte-routing"
import { user } from "./gun"

import Auth from "./pages/Auth.svelte"
import SecureHome from "./secure-routes/SecureHome.svelte"
import SecureBookForm from "./secure-routes/SecureBookForm.svelte"
import SecureBook from "./secure-routes/SecureBook.svelte"
import SecureBookEdit from "./secure-routes/SecureBookEdit.svelte"
import SecureBooksList from "./secure-routes/SecureBooksList.svelte"
import SecureMyProfile from "./secure-routes/SecureMyProfile.svelte"
import SecureBookPages from "./secure-routes/SecureBookPages.svelte"

onMount(() => {
  if (user.is) {
    setCurrentUser()
  }
})
</script>

<Router>
  <Route path="/" component="{Auth}" />
  <Route path="/my-profile" component="{SecureMyProfile}" />
  <Route path="/user/:userId" component="{SecureMyProfile}" />
  <Route path="/home" component="{SecureHome}" />
  <Route path="/create-book" component="{SecureBookForm}" />
  <Route path="/my-books" component="{SecureBooksList}" />
  <Route path="/my-books/:id" component="{SecureBookEdit}" />
  <Route path="/book/:id" component="{SecureBook}" />
  <Route path="/book/:id/pages" component="{SecureBookPages}" />
</Router>
