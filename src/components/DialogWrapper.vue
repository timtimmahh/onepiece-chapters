<template>
  <q-dialog ref="dialog" width="600px" @hide="onDialogHide">
    <q-card>
      <q-card-section>
        <span class="headline">{{ title }}</span>
      </q-card-section>
      <q-card-section>
        <div class="" v-html="content"/>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    title: String,
    content: String,
  },
  methods: {
    show() {
      this.$refs.dialog.show();
    },
    hide() {
      this.$refs.dialog.hide();
    },
    onDialogHide() {
      this.$emit("hide");
    },
    onOKClick() {
      this.$emit('ok');
      this.hide();
    },
    onCancelClick() {
      this.hide();
    }
  },
};
</script>
