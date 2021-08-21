<template>
  <main class="w-[140px] px-2 py-3 text-center text-gray-700">
    <div class="font-bold justify-center flex">
      Hand tracking <span class="text-base ml-1"><ph-hand /></span>
    </div>
    <div class="mt-2">
      <ToggleButton :model-value="checked" @update:modelValue="changeTrackStatus" />
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { CHANGE_TRACK_STATUS, CHECK_TRACK_STATUS, ON_ICON_PATH, OFF_ICON_PATH } from '~/utils/constants'

type RequestArgs = {
  type: string
}
const sendMessageToCurrentTab = (message: RequestArgs, callback?: (...any) => void) => {
  chrome.tabs.query({ active: true, currentWindow: true }, async(tabs) => {
    const currentTab = tabs[0]
    chrome.tabs.sendMessage(currentTab.id, message, callback)
  })
}

export default defineComponent({
  name: 'Popup',
  setup() {
    const checked = ref(false)

    const changeTrackStatus = (val: boolean) => {
      sendMessageToCurrentTab({ type: CHANGE_TRACK_STATUS, value: val })
    }

    onMounted(() => {
      sendMessageToCurrentTab({ type: CHECK_TRACK_STATUS }, (status) => {
        checked.value = !!status
      })
    })

    return {
      checked,
      changeTrackStatus,
    }
  },
})
</script>
