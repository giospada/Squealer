<script setup lang="ts">
import { currentClientInject, type currentClientType } from '@/keys'
import { inject, computed } from 'vue'
import BuyModalVue from '@/components/BuyQuotaForm.vue'
import { urgentThreshold } from '@model/quota'
import ChooseClientsVue from '@/components/ChooseClients.vue'

const { currentClient, setClient: _ } = inject<currentClientType>(currentClientInject)!

const quotaDay = computed<number>(() => {
  return currentClient.value.maxQuota.day - currentClient.value.usedQuota.day
})
</script>

<template>
  <div class="content">
    <ChooseClientsVue />
    <BuyModalVue :username="currentClient.username" :urgent="quotaDay < urgentThreshold" />
  </div>
</template>
