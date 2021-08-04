<template>
  <main class="h-main h-page">
    <h1 class="h-title">Account</h1>
    <div class="flex flex-col gap-6 p-4 border default-border rounded">
      <div class="flex flex-col gap-2">
        <h3 class="text-base font-medium">Username</h3>
        <div v-if="!username.updating" class="flex flex-row gap-3 items-center">
          <span>{{ profile.username }}</span>
          <base-button size="small" @click="startUpdatingUsername()">Change</base-button>
        </div>
        <div v-else>
          <div class="flex flex-col gap-2">
            <base-input v-model="username.new" size="small" name="new-username" placeholder="New Username" />
            <div class="flex flex-row gap-2 justify-start">
              <base-button size="small" @click="cancelUpdatingUsername()">Cancel</base-button>
              <base-button size="small" color="primary" :disabled="!username.new" @click="updateUsername()">
                Update
              </base-button>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <h3 class="text-base font-medium">Email</h3>
        <div v-if="!email.updating" class="flex flex-row gap-3 items-center">
          <span>{{ profile.email }}</span>
          <base-button size="small" @click="startUpdatingEmail()">Change</base-button>
        </div>
        <div v-else>
          <div class="flex flex-col gap-2">
            <div class="flex flex-row gap-2">
              <base-input
                v-model="email.new"
                size="small"
                type="email"
                name="new-email"
                placeholder="email@gmail.com"
              />
              <base-input
                v-model="email.confirmation"
                size="small"
                type="password"
                name="password-confiration"
                placeholder="Current Password"
              />
            </div>
            <div class="flex flex-row gap-2 justify-start">
              <base-button size="small" @click="cancelUpdatingEmail()">Cancel</base-button>
              <base-button
                size="small"
                color="primary"
                :disabled="!(email.new && email.confirmation)"
                @click="updateEmail()"
              >
                Update
              </base-button>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <h3 class="text-base font-medium">Password</h3>
        <div v-if="!password.updating" class="flex flex-row gap-3 items-center">
          <span>••••••••••••</span>
          <base-button size="small" @click="startUpdatingPassword()">Change</base-button>
        </div>
        <div v-else>
          <div class="flex flex-col gap-2">
            <div class="flex flex-row gap-2">
              <base-input
                v-model="password.new"
                size="small"
                type="password"
                name="new-password"
                placeholder="New Password"
              />
              <base-input
                v-model="password.confirmation"
                size="small"
                type="password"
                name="password-confiration"
                placeholder="Current Password"
              />
            </div>
            <div class="flex flex-row gap-2 justify-start">
              <base-button size="small" @click="cancelUpdatingPassword()">Cancel</base-button>
              <base-button
                size="small"
                color="primary"
                :disabled="!(password.new && password.confirmation)"
                @click="updatePassword()"
              >
                Update
              </base-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { changeProfilePassword, changeProfileUsername } from '@/api'

export default {
  middleware: ['auth-required'],
  data() {
    return {
      username: {
        updating: false,
        new: '',
      },
      email: {
        updating: false,
        new: '',
        confirmation: '',
      },
      password: {
        updating: false,
        new: '',
        confirmation: '',
      },
    }
  },
  computed: {
    profile() {
      return this.$store.state.user.profile
    },
  },
  methods: {
    startUpdatingUsername() {
      this.username.updating = true
    },
    cancelUpdatingUsername() {
      this.username.updating = false
      this.username.new = ''
    },
    async updateUsername() {
      try {
        await changeProfileUsername(this.username.new)
        await this.$store.dispatch('user/getProfile')
        this.username.updating = false
        this.$notify.show({
          message: 'Username successfully updated',
          type: 'success',
        })
      } catch (error) {
        this.$notify.show({
          message: error.response.data.message,
          type: 'danger',
        })
      } finally {
        this.username.new = ''
      }
    },
    /**/
    startUpdatingEmail() {
      this.email.updating = true
    },
    cancelUpdatingEmail() {
      this.email.updating = false
      this.email.new = ''
      this.email.confirmation = ''
    },
    updateEmail() {
      this.email.updating = false
    },
    /**/
    startUpdatingPassword() {
      this.password.updating = true
    },
    cancelUpdatingPassword() {
      this.password.updating = false
      this.password.new = ''
      this.password.confirmation = ''
    },
    async updatePassword() {
      try {
        await changeProfilePassword({ password: this.password.new, prevPassword: this.password.confirmation })
        this.password.updating = false
        this.$notify.show({
          message: 'Password successfully updated',
          type: 'success',
        })
      } catch (error) {
        this.$notify.show({
          message: error.response.data.message,
          type: 'danger',
        })
      } finally {
        this.password.new = ''
        this.password.confirmation = ''
      }
    },
  },
}
</script>