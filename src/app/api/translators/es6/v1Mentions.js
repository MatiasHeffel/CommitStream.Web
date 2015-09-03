  let v1Mentions = {};

  v1Mentions.getWorkitems = (message) => {
    let re = new RegExp("[A-Z,a-z]{1,2}-[0-9]+", "g");
    let matches = message.match(re);
    matches = matches === null ? [] : matches;
    let mentions = [];
    matches.forEach(wi => mentions.push(wi.toUpperCase()));    
    return mentions;
  };

  export default v1Mentions;
