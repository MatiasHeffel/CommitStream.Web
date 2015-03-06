$adminKey = '32527e4a-e5ac-46f5-9bad-2c9b7d607bd7'
$csUrl = 'http://localhost:6565'
$ct = 'application/json'

function getCommitSample() {
  $c = @{}
  $c.id = 'b42c285e1506edac965g92573a2121700fc92f8b'
  $c.distinct = $true
  $c.message = 'S-12345 Updated Happy Path Validations!'
  $c.timestamp =  '2014-10-03T15:57:14-03:00'
  $c.url = 'https://github.com/kunzimariano/CommitService.DemoRepo/commit/b42c285e1506edac965g92573a2121700fc92f8b'
  $c.added = @()
  $c.removed = @()
  $c.modified = ,'README.md'

  $c.author = @{}
  $c.author.name = 'shawnmarie'
  $c.author.email = 'shawn.abbott@versionone.com'
  $c.author.username = 'shawnmarie'

  $c.committer = @{}
  $c.committer.name = 'shawnmarie'
  $c.committer.email = 'shawn.abbott@versionone.com'
  $c.committer.username = 'shawnmarie'

  $commits = @{}
  $commits.ref = 'refs/heads/master'
  $commits.commits = ,$c
  $commits.repository = @{ 'id' = 23355501; 'name' = 'CommitService.DemoRepo' }

  $jsonCommits = (ConvertTo-Json $commits -Depth 4)
  $jsonCommits
}

function pushCommit() {
  param($c, $url)

  $response = Invoke-RestMethod -Method Post `
    -ContentType $ct `
    -Headers @{ 'x-github-event' = 'push' } `
    -Body $c `
    -Uri $url

  $response
}

$commitsUrl = 'http://localhost:6565/api/5d5154f5-65ef-475a-8a71-47e4d1f63a53/inboxes/4c73dd75-ae3f-43f4-b957-4327eab4fe49/commits?apiKey=6d75d3f0-6311-46eb-a234-cb23deef8e78'

$sample = getCommitSample
$response = pushCommit  $sample $commitsUrl