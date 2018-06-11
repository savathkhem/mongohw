$(document).ready(function () {

  $(document).ready(function () {
    renderEmpty();
    renderMain();
  })



  // RENDER FUNCTIONS
  function renderMain() {
    $("#main").append(`
  <header>
      <div class="bg" style="background-image: url(https://mdbootstrap.com/img/Photos/Others/img%20%2844%29.jpg); background-position: center center;">
          <div>
              <div class="container flex-center text-center">
                  <div class="col-md-12 mb-3">
                      <h1 class="display-3 mb-2 wow fadeInDown" data-wow-delay="0.3s" style="
                      padding-top: 200px">MONGO
                          <a class="indigo-text font-weight-bold">SCRAPER</a>
                      </h1>
                      <h5 class="text-uppercase mb-3 mt-1 font-weight-bold wow fadeIn" data-wow-delay="0.4s">You click... We scrape...</h5>
                  </div>
              </div>
          </div>
      </div>
  </header>
  `);
  };

  // EMPTY RENDER
  function renderEmpty() {
    $("#main").empty();
    $("#articles").empty();
    $("#notes").empty();
  };

  // RENDER ARTICLES
  function renderArticles(data) {
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append(`
  <div class="card">
    <h5 data-id=${data[i]._id} class="card-header">${data[i].title}</h5>
      <div class="card-body">
        <a href="${data[i].link}" class="btn btn-primary" target="_blank">Link</a>
        <!-- <a class="btn btn-warning" id="favorites" data-id="${data[i]._id}">Favorite</a> -->
        <a class="btn btn-danger" data-toggle="modal" data-target="#modalNotes${data[i]._id}">Notes</a>
      </div>
  </div>

  <!-- Modal -->
  <div class="modal fade" id="modalNotes${data[i]._id}" tabindex="-1" role="dialog" aria-labelledby="modalNotesTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
              <div class="modal-header">
                  <h5 class="modal-title" id="modalNotesTitle${data[i]._id}">${data[i].title}</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                  </button>
              </div>

              <div class="modal-body">
                <form>
                  <div class="form-group">
                    <label for="Title">Title</label>
                    <input class="form-control" id='titleinput' name='title' placeholder="Type a Title for this note">
                  </div>
                  <div class="form-group">
                    <label for="body">Body</label>
                    <textarea class="form-control" id="bodyinput" name='body' placeholder="Type some notes you would like to save" rows="3"></textarea>
                  </div>
                </form>
              </div>

              <div class="modal-footer">
              <button type="button" class="btn btn-danger" data-id=${data[i]._id} id='savenote'>Save</button>
              </div>

          </div>
      </div>
  </div>
  `);
    }
  };


  // When you click the savenote button
  $(document).on("click", "#savenote", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
          // Value taken from title input
          title: $("#titleinput").val(),
          // Value taken from note textarea
          body: $("#bodyinput").val()
        }
      })
      // With that done
      .then(function (data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        // $("#notes").empty();
      });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });


  // 2: Button Interactions
  // ======================

  // WHEN USERS CLICK THE SCRAPER BUTTON, WE SCRAPED ARTICLES
  $("#scraper").on("click", function () {
    console.log("scraped")
    $.ajax({
      method: "GET",
      url: "/scrape/"
    })
  });

  $(".favorite").on("click", function () {
    console.log('click')
    var thisId = $(this).attr("data-id");
    $.ajax({
      method: "PUT",
      url: "/favorite/" + thisId,
      data: {
        favorite: true,
      }
    })
  });

  // WHEN USER CLICKS THE ARTICLES BUTTON, WE POPULATE ARTICLES TO PAGE
  $('#showarticles').on('click', function () {
    renderEmpty();
    // Grab the articles as a json
    $.getJSON("/articles", function (data) {
      console.log(data);
      // For each one
      $("#articles").append(`
        <div class="container">
          <div class="row">
            <div class="col-md-12 text-center mb-3">
                <h1 class="font-weight-bold light-blue-text my-3">ARTICLES</h1>
                </div>
            </div>
        </div>
    `)
      renderArticles(data);
    });
  });


  // WHEN USER CLICKS THE HOME BUTTON, WE POPULATE HOME SCREEN
  $("#showHome").on("click", function () {
    renderEmpty()
    renderMain();
  });

});