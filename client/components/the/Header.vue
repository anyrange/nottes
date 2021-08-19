<template>
  <header class="flex py-3 lg:py-6 border-b default-border">
    <div class="flex sm:flex-row flex-col h-container">
      <nav class="w-full flex flex-row gap-2 items-center justify-between">
        <nuxt-link class="text-2xl font-normal" to="/">nottes</nuxt-link>
        <div class="sm:flex hidden items-center gap-2">
          <template v-if="!authenticated">
            <base-button color="flat" aria-label="Sign up" @click="$router.push('/signup')">Sign up</base-button>
            <base-button color="primary" aria-label="Login" @click="$router.push('/login')">Login</base-button>
          </template>
          <template v-else>
            <div class="relative inline-block text-left">
              <div v-click-outside="closeDropdown">
                <a
                  class="justify-center cursor-pointer w-full rounded h-10 flex items-center px-4 focus:outline-none"
                  aria-expanded="true"
                  aria-haspopup="true"
                  @click="toggleDropdown"
                >
                  <img v-if="user.avatar" class="avatar w-7 h-7" :src="user.avatar" :alt="user.username" />
                  <span v-else>
                    {{ user.username }}
                  </span>
                  <svg
                    class="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </a>
              </div>
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div
                  v-show="dropdownOpened"
                  class="
                    origin-top-right
                    absolute
                    right-4
                    w-56
                    rounded
                    border
                    default-border
                    shadow-lg
                    dark:bg-gray-700-spotify
                    bg-white
                    focus:outline-none
                  "
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="menu-button"
                >
                  <div class="py-1 text-sm" role="none">
                    <nuxt-link class="navbar-link-desktop" :to="`/user/${user.username}`">Profile</nuxt-link>
                    <nuxt-link class="navbar-link-desktop" to="/account">Settings</nuxt-link>
                    <a href="#" class="navbar-link-desktop" @click="logout()">Logout</a>
                  </div>
                </div>
              </transition>
            </div>
          </template>
        </div>
        <div class="flex sm:hidden">
          <button
            type="button"
            class="inline-flex items-center justify-center p-2 tool-icon"
            aria-controls="mobile-menu"
            aria-expanded="false"
            @click="toggleNavbar()"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              v-if="navbarOpened"
              class="block h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <svg
              v-else
              class="block h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
      <div v-if="navbarOpened" class="pt-6 space-y-1 sm:hidden flex flex-col">
        <template v-if="authenticated">
          <nuxt-link class="navbar-link-mobile" :to="`/user/${user.username}`">Profile</nuxt-link>
          <nuxt-link class="navbar-link-mobile" to="/account">Settings</nuxt-link>
          <a href="#" class="navbar-link-mobile" @click="logout()">Logout</a>
        </template>
        <template v-else>
          <base-button color="primary" aria-label="Login" @click="$router.push('/login')">Login</base-button>
          <base-button color="flat" aria-label="Sign up" @click="$router.push('/signup')">Sign up</base-button>
        </template>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'TheHeader',
  data() {
    return {
      dropdownOpened: false,
      navbarOpened: false,
      routeChange: false,
    }
  },
  computed: {
    authenticated() {
      return this.$store.state.authenticated
    },
    user() {
      return this.$store.state.user.profile
    },
  },
  watch: {
    $route() {
      this.routeChange = true
      this.navbarOpened = false
      this.dropdownOpened = false
    },
  },
  methods: {
    async logout() {
      try {
        await this.$store.dispatch('logout')
        this.$router.push('/')
        this.dropdownOpened = false
      } catch (err) {
        console.log(err)
      }
    },
    toggleDropdown() {
      this.dropdownOpened = !this.dropdownOpened
    },
    closeDropdown() {
      this.dropdownOpened = false
    },
    toggleNavbar() {
      this.navbarOpened = !this.navbarOpened
    },
  },
}
</script>
