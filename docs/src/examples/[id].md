<script setup>
import { ref, computed, onMounted, nextTick, onUnmounted } from 'vue'
import { useData } from 'vitepress'

const { params } = useData();

// Lazy load the example module when the component is mounted
onMounted(async () => {
  await nextTick();
  const { run } = await import(`./data/${params.value.id}.ts`);
  run();
})

// Clean up the allegro-ts instance when the component is unmounted
onUnmounted(() => {
  window.allegro_exit?.();
})
</script>

<!-- @content -->
