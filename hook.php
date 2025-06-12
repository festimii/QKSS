<?php
// Replace with the same secret you’ll configure in GitHub
$secret = 'Darkstar123Festim';

$payload   = file_get_contents('php://input');
$signature = 'sha1=' . hash_hmac('sha1', $payload, $secret);

if (!hash_equals($_SERVER['HTTP_X_HUB_SIGNATURE'] ?? '', $signature)) {
  http_response_code(403);
  exit('Bad signature');
}

chdir(__DIR__);
exec('git fetch --all && git reset --hard origin/main 2>&1', $output, $ret);
header('Content-Type: text/plain');
echo implode("\n", $output);