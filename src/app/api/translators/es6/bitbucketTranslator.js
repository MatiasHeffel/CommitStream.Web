import _ from 'underscore';
import uuid from 'uuid-v4';
import BitbucketCommitMalformedError from '../../middleware/bitbucketCommitMalformedError';
import v1Mentions from './v1Mentions';

let bitbucketTranslator = {};

let hasCorrectHeaders = headers => headers.hasOwnProperty('x-event-key') && headers['x-event-key'] === 'repo:push';

bitbucketTranslator.canTranslate = request => hasCorrectHeaders(request.headers);

// https://serverUrl/repoOwner/repoName
let getRepoHref = (repoInfo) =>
  repoInfo.serverUrl + '/' + repoInfo.repoOwner + '/' + repoInfo.repoName;

// http://serverUrl/repoOwner/reponame/tree/branchName
let getBranchHref = (repoHref, branch) => repoHref + '/tree/' + branch;

let getRepoInfo = (commitUrl) => {

  let repoArray;

  repoArray = commitUrl.split('/commits')[0].split('/');

  r = {};
  r.repoName = repoArray.pop();
  r.repoOwner = repoArray.pop();
  r.serverUrl = repoArray.pop();

  if (repoArray.pop() === '') {
    r.serverUrl = repoArray.pop() + '//' + r.serverUrl;
  }

  return r;
};

bitbucketTranslator.translatePush = (pushEvent, instanceId, digestId, inboxId) => {
  try {
    let latestCommit = pushEvent.push.changes[0].new;
    //TODO: we only have the date of the newest commit in the push.
    //Do we want to use it for every commit?
    let branch = latestCommit.name;
    let date = latestCommit.target.date;
    let repository = {
      id: pushEvent.repository.uuid,
      name: pushEvent.repository.name
    };
    // Bitbucket puts the newest commits firts hence the reverse
    let commits = pushEvent.push.changes[0].commits.reverse();
    let events = _.map(commits, aCommit => {
      let commit = {
        instanceId,
        digestId,
        inboxId,
        eventType: 'BitbucketCommitReceived',
        sha: aCommit.hash,
        commit: {
          author: aCommit.author.user.username,
          // bitbucket does not have a commit.committer object. Using the same thing as author for now.
          committer: {
            name: aCommit.author.user.display_name,
            email: aCommit.author.raw,
            date
          },
          message: aCommit.message
        },
        html_url: aCommit.links.html.href,
        repository,
        branch,
        mentions: v1Mentions.getWorkitems(aCommit.message),
        family: 'Bitbucket',
        originalMessage: aCommit
      };
      let repoInfo = getRepoInfo(commit.html_url);
      commit.repoHref = getRepoHref(repoInfo);
      commit.repo = repoInfo.repoOwner + '/' + repoInfo.repoName;
      commit.branchHref = getBranchHref(commit.repoHref, branch);
      return commit;

    });

    return events;
  } catch (ex) {
    throw new BitbucketCommitMalformedError(ex, pushEvent);
  }
};

export
default bitbucketTranslator;