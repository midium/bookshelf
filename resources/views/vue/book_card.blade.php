<template id="book-card-template">
  <div class="col col-md-@{{columnWidth()}} mbs mbs-book-card centered" data-id="@{{myBook.id}}">
      <div class="mbs mbs-book-cover img-responsive card effect_click" style="background:url(@{{myBook.cover}}) no-repeat; background-size: cover; background-position: center;" v-bind:class="{flipped: flipped_card && showDetails}" @click="cardFlip">
        <input type="hidden" v-model="book_id" value="@{{myBook.id}}" />
        <div class="card_front">
          <i class="mbs-book-read fa fa-bookmark pull-left" v-if="myBook.isRead"></i>
          <div class="overlay">
            <div class="container-fluid">
              <div class="row cover">&nbsp;</div>

              <div class="row" v-if="hasTools">
                <div class="col col-md-3 tools-col centered no-padding">
                  <a class="no-decoration-link" href="{{url('/book/')}}/@{{myBook.id}}" data-toggle="tooltip" data-placement="top" title="Book Details" @click="bookDetails">
                    <i class="mbs-book-tools icon-Book">
                      <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span>
                    </i>
                  </a>
                </div>
                <div class="col col-md-3 tools-col centered no-padding">
                  <a class="no-decoration-link" href="{{url('/reads/')}}/@{{myBook.id}}" data-toggle="tooltip" data-placement="top" title="Book Reads" @click="bookReads">
                    <i class="mbs-book-tools icon-Bookmark">
                      <span class="path1"></span><span class="path2"></span>
                    </i>
                  </a>
                </div>
                <div class="col col-md-3 tools-col centered no-padding" v-if="allowEdit">
                  <a class="no-decoration-link" href="#" data-toggle="tooltip" data-placement="top" title="Edit Book" @click="editBook"><i class="mbs-book-tools icon-Pen"></i></a>
                </div>
                <div class="col col-md-3 tools-col centered no-padding" v-if="allowDelete">
                  <a class="no-decoration-link" href="#" data-toggle="tooltip" data-placement="top" title="Delete Book" @click="deleteBook"><i class="mbs-book-tools icon-Bin"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card_back" v-if="showDetails">
          <p class="mbs mbs-book-details-header">Summary</p>
          <article class="mbs mbs-book-description">@{{myBook.description}}</article>
          <input type="hidden" class="rating" data-readonly value="@{{myBook.vote}}" data-filled="glyphicon glyphicon-star-empty mbs-rating-symbol mbs-symbol-filled" data-empty="glyphicon glyphicon-star-empty mbs-rating-symbol"/>
          <p class="mbs mbs-book-details-header-topborder">Genres</p>
          <article class="mbs mbs-book-genres">
            @{{{myBook.genres}}}
          </article>
        </div>
      </div>
      <span class="mbs mbs-book-title">@{{myBook.title}}</span>
      <span class="mbs mbs-book-minor-info" v-if="myBook.authors">by @{{{myBook.authors}}}</span>
      <input type="hidden" class="rating" data-readonly value="@{{myBook.vote}}" data-filled="glyphicon glyphicon-star-empty mbs-rating-symbol mbs-symbol-filled mbs-symbol-small" data-empty="glyphicon glyphicon-star-empty mbs-rating-symbol mbs-symbol-small"/>
      <span class="mbs mbs-book-minor-info" v-if="myBook.reading_since">on read: <strong>@{{myBook.reading_since}}</strong> (@{{myBook.time_lapsed}})</span>
  </div>
</template>
