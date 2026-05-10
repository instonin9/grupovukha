<template>
  <div class="toolbar">
    <button
      v-for="tool in tools"
      :key="tool.type"
      @click="$emit('select-tool', tool.type)"
      :class="['tool-btn', { active: selectedTool === tool.type }]"
    >
      {{ tool.label }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'Toolbar',
  props: {
    selectedTool: { type: String, default: null }
  },
  emits: ['select-tool'],
  data() {
    return {
      tools: [
        { type: 'text', label: 'Текст' },
        { type: 'image', label: 'Изобр.' },
        { type: 'line', label: 'Линия' },
        { type: 'rect', label: 'Прям.' },
        { type: 'triangle', label: 'Треуг.' },
        { type: 'circle', label: 'Круг' }
      ]
    }
  }
}
</script>

<style scoped>
.toolbar {
  display: flex;
  gap: 8px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.tool-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.tool-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.tool-btn.active {
  background: rgba(102, 126, 234, 0.6);
  border-color: #667eea;
}
</style>