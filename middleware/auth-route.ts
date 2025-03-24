export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log('middle-to', to)
  console.log('middle-from', from)
})
