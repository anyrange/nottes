<template>
  <aside class="flex flex-col gap-4">
    <h1 class="h-title">Recent Pastes</h1>
    <transition-group tag="div" name="list" class="flex flex-col gap-3">
      <div v-for="paste in pastes" :key="paste.id" class="flex flex-row gap-2 items-center justify-between">
        <div class="flex flex-col w-10/12">
          <nuxt-link class="link truncate" :to="'/' + paste.id">
            {{ paste.title }}
          </nuxt-link>
          <div class="text-xs truncate">
            <span>by</span>
            <nuxt-link
              :class="[paste.author.username === 'Guest' ? 'pointer-events-none' : 'hover:underline']"
              :to="'/user/' + paste.author.username || 'Guest'"
            >
              <i>{{ paste.author.username }}</i>
            </nuxt-link>
          </div>
        </div>
        <div>
          <span v-tooltip:bottom-left="$timePassedFrom(paste.date)">
            <fa :icon="['far', 'clock']" />
          </span>
        </div>
      </div>
    </transition-group>
  </aside>
</template>

<script>
import { getRecentPastes } from '@/api'

export default {
  name: 'TheSidebar',
  data() {
    return {
      pastes: [],
    }
  },
  created() {
    this.pastes = getRecentPastes()
  },
}
</script>
