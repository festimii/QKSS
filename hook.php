<?php
// Replace with your webhook secret
$secret = 'Darkstar123Festim';

// Read payload and compute signature
$payload   = file_get_contents('php://input');
$signature = 'sha1=' . hash_hmac('sha1', $payload, $secret);

// Reject bad signatures
if (!hash_equals($_SERVER['HTTP_X_HUB_SIGNATURE'] ?? '', $signature)) {
    http_response_code(403);
    exit('Bad signature');
}

// Switch to repo dir
chdir(__DIR__);

// Absolute path to git binary
$git = '/usr/bin/git';

// Fetch & reset
exec("$git fetch --all 2>&1", $out1, $ret1);
exec("$git reset --hard origin/main 2>&1", $out2, $ret2);

// Log for debugging (optional)
file_put_contents('/tmp/hook.log',
    date('[Y-m-d H:i:s] '). "FETCH ret=$ret1\n". implode("\n", $out1) ."\n"
  . "RESET ret=$ret2\n". implode("\n", $out2) ."\n\n",
    FILE_APPEND);

// Return the git output
header('Content-Type: text/plain');
echo implode("\n", $out1) . "\n" . implode("\n", $out2);
