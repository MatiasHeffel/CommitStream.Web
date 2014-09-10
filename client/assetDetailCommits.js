function assetDetailCommits(eventStoreQueryUrl, templateUrl, selector) {
  var commits = [];
  $.getJSON(eventStoreQueryUrl).done(function(events) {
    $.each(events.entries, function(index, value) {
      var e = value.content.data;
      var c = {
        timeFormatted: moment(e.commit.committer.date).fromNow(),
        author: e.commit.committer.name,
        sha1Partial: e.commit.tree.sha.substring(0,6),
        action: "committed",
        message: e.commit.message,
        commitHref: e.html_url
      };
      commits.push(c);
    });
    var data = {
      commits: commits
    };
    if (commits.length > 0) {
      $.getScript("http://cdnjs.cloudflare.com/ajax/libs/moment.js/2.8.2/moment.min.js", 
        function(data, status, jqxhr) {
        $.get(templateUrl).done(function(source) {
          var template = Handlebars.compile(source);
          var content = template(data);
          $(selector).html(content);
        });
      });
    }
  });
}
