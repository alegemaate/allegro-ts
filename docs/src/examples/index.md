---
title: Examples
---

<script setup>
import items from '../examples.manifest.json'
</script>

# Examples

Total: {{ items.length }}

<ul>
  <li v-for="it in items" :key="it.id">
    <a :href="it.href">{{ it.id }}</a>
  </li>
</ul>
