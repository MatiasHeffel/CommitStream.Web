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

function createInstance() {
  param($instanceId)

  $body = @{}
  $body.instanceId = $instanceId

  $response = Invoke-RestMethod -Method Post `
    -ContentType $ct `
    -Body (ConvertTo-Json $body) `
    -Uri $csUrl/api/instances?apiKey=$adminKey

  $response
}

function createDigest() {
  param($digestUrl, $description)

  $body = @{}
  $body.description = $description

  $response = Invoke-RestMethod -Method Post `
    -ContentType $ct `
    -Body (ConvertTo-Json $body) `
    -Uri $digestUrl

  $response
}

function createInbox() {
  param($inboxesUrl, $inboxName, $repoUrl)

  $body = @{}
  $body.family = 'GitHub'
  $body.name = $inboxName
  $body.url = $repoUrl

  $response = Invoke-RestMethod -Method Post `
  -ContentType $ct `
  -Body (ConvertTo-Json $body) `
  -Uri $inboxesUrl

  $response
}

$instanceId = [guid]::NewGuid()
$response = createInstance $instanceId
Write-Host "instanceId: $instanceId"
$instanceApiKey = $response.apiKey
Write-Host "instanceApiKey: $instanceApiKey"

$digestsUrl = $response._links.digests.href + "?apiKey=$instanceApiKey"
Write-Host "digestsUrl: $digestsUrl"

$response = createDigest $digestsUrl 'Some random digest'

$createInboxUrl = $response._links.'inbox-create'.href + "?apiKey=$instanceApiKey"

$response = createInbox $createInboxUrl 'Some Inbox Name' 'https://github.com/fakeuser/fakerepo'
$commitsUrl = $response._links.'add-commit'.href + "?apiKey=$instanceApiKey"

Write-Host $commitsUrl
$sample = getCommitSample
$response = pushCommit  $sample $commitsUrl

#Write-Host (ConvertTo-Json $response -Depth 4)