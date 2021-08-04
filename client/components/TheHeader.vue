<template>
  <header class="flex py-3 lg:py-6 border-b default-border">
    <div class="flex items-center justify-between h-container">
      <nuxt-link class="text-2xl font-normal" to="/">nottes</nuxt-link>
      <nav class="sm:flex gap-2 items-center hidden">
        <template v-if="!authenticated">
          <base-button color="flat" aria-label="Sign up" @click="$router.push('/signup')"> Sign up </base-button>
          <base-button color="primary" aria-label="Login" @click="$router.push('/login')"> Login </base-button>
        </template>
        <template v-else>
          <div class="relative inline-block text-left">
            <div v-click-outside="closeDropdown">
              <button
                id="menu-button"
                type="button"
                class="
                  justify-center
                  w-full
                  rounded
                  h-10
                  flex
                  items-center
                  px-4
                  hover:bg-gray-50
                  dark:hover:bg-gray-600-spotify dark:hover:bg-opacity-20
                  focus:outline-none
                "
                aria-expanded="true"
                aria-haspopup="true"
                @click="toggleDropdown"
              >
                {{ user.username }}
                <svg
                  class="-mr-1 ml-2 h-5 w-5"
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
              </button>
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
                  right-0
                  mt-2
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
                  <nuxt-link
                    class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600-spotify"
                    :to="`/user/${user.username}`"
                  >
                    Profile
                  </nuxt-link>
                  <nuxt-link class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600-spotify" to="/account">
                    Settings
                  </nuxt-link>
                  <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600-spotify" @click="logout">
                    Logout
                  </a>
                </div>
              </div>
            </transition>
          </div>
        </template>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: 'TheHeader',
  data() {
    return {
      dropdownOpened: false,
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
  },
}
</script>
