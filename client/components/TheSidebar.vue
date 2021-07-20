<template>
  <main class="h-main">
    <h1 class="h-title">Recent Pastes</h1>
    <div class="flex flex-col">
      <div v-for="paste in pastes" :key="paste.id" class="flex items-center justify-between">
        <div class="flex flex-col">
          <a class="text-base text-blue-500 hover:underline" href="#">
            {{ paste.name }}
          </a>
          <div class="text-xs">
            by <i>{{ paste.author }}</i>
          </div>
        </div>
        <i>Ϭ</i>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'TheSidebar',
  data() {
    return {
      pastes: [
        {
          id: '1',
          name: 'pastes',
          author: 'tahse',
        },
      ],
    }
  },
}
</script>
