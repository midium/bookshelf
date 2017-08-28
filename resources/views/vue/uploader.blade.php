<template id="uploader-template">
  <div class="vue-uploader">
    <div class="vue-uploader image-wrapper">
      <i v-show="! imageSrc" class="icon fa fa-picture-o"></i>
      <img v-show="imageSrc" id="imageSrc" class="vue-uploader image" :src="imageSrc">
    </div>

    <div class="btn btn-default vue-uploader input-wrapper">
      Choose
      <input @change="previewThumbnail" class="vue-uploader input" name="thumbnail" id="thumbnail" type="file">
    </div>
    <button type="button" class="btn btn-default vue-uploader input-wrapper" @click="clearThumbnail" v-bind:disabled="isClearable">
      Clear
    </button>
  </div>
</template>
