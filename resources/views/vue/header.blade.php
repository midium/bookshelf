<template id="header-control-template">
  <span v-if="isMobileView">
    <div class="col col-sm-6">
      <div v-if="showImage" class="img-responsive img-thumbnail mbs mbs-header-image"
          style="background:url(@{{imageUrl}}) no-repeat; background-size: cover; background-position: center;"></div>
      <span class="mbs mbs-head-text">
        <span v-bind:class="{'mbs-cutted-header': isMobileView}">@{{{headerTitle}}}</span>
        <span v-if="showBadge" class="mbs mbs-count-badge"><span class="badge">@{{{badgeText}}}</span></span>
        <a v-if="addButton" class="mbs mbs-add-link" href="#" data-toggle="tooltip" data-placement="right" title="@{{addButtonTooltip}}" @click="addItem">
          <i class="icon-Add">
            <span class="path1"></span><span class="path2"></span>
          </i>
        </a>
        <a v-if="exportExcel" class="mbs mbs-add-link" href="#" data-toggle="tooltip" data-placement="right" title="@{{exportButtonTooltip}}" @click="exportItem">
          <i class="icon-Copy">
            <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span>
          </i>
        </a>
        <a class="btn btn-sm btn-default" v-show="(searchPerformed && clearButton) || (searchFor && filterSearch && clearButton)" @click="clearFilter">
          <i class="icon-Cancel">
            <span class="path1"></span><span class="path2"></span>
          </i>
          Clear Search
        </a>
      </span>
    </div>
    <div class="col col-sm-6">
      <div class="mbs mbs-head-search">
        <div class="mbs mbs-seach-overlay clearfix" v-if="search">
          <input type="text" name="text_to_search" id="text_to_search" v-model="searchFor" placeholder="@{{searchPlaceholder}}" @keyup.enter="setFilter"/>
          <button type="submit" class="mbs mbs-button" @click="setFilter"><i class="glyphicon glyphicon-search"></i></button>
        </div>
        <button v-if="backButton" class="btn btn-sm btn-default" onclick="window.history.back()">Back</button>
      </div>
    </div>
  </span>

  <div v-if="showImage && !isMobileView" class="img-responsive img-thumbnail mbs mbs-header-image"
      style="background:url(@{{imageUrl}}) no-repeat; background-size: cover; background-position: center;"></div>
  <span class="mbs mbs-head-text" v-if="!isMobileView">
    <span v-bind:class="{'mbs-cutted-header': isMobileView}">@{{{headerTitle}}}</span>
    <span v-if="showBadge" class="mbs mbs-count-badge"><span class="badge">@{{{badgeText}}}</span></span>
    <a v-if="addButton" class="mbs mbs-add-link" href="#" data-toggle="tooltip" data-placement="right" title="@{{addButtonTooltip}}" @click="addItem">
      <i class="icon-Add">
        <span class="path1"></span><span class="path2"></span>
      </i>
    </a>
    <a v-if="exportExcel" class="mbs mbs-add-link" href="#" data-toggle="tooltip" data-placement="right" title="@{{exportButtonTooltip}}" @click="exportItem">
      <i class="icon-Copy">
        <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span>
      </i>
    </a>
    <a class="btn btn-sm btn-default" v-show="(searchPerformed && clearButton) || (searchFor && filterSearch && clearButton)" @click="clearFilter">
      <i class="icon-Cancel">
        <span class="path1"></span><span class="path2"></span>
      </i>
      Clear Search
    </a>
  </span>
  <div class="mbs mbs-head-search" v-if="!isMobileView">
    <div class="mbs mbs-seach-overlay clearfix" v-if="search">
      <input type="text" name="text_to_search" id="text_to_search" v-model="searchFor" placeholder="@{{searchPlaceholder}}" @keyup.enter="setFilter"/>
      <button type="submit" class="mbs mbs-button" @click="setFilter"><i class="glyphicon glyphicon-search"></i></button>
    </div>
    <button v-if="backButton" class="btn btn-sm btn-default" onclick="window.history.back()">Back</button>
  </div>
</template>
