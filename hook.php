<?php
$secret     = 'Darkstar123Festim';
$repoUrl    = 'git@github.com:festimii/QKSS.git'; 
$publishDir = '/var/www/html';
$git        = '/usr/bin/git';
$payload   = file_get_contents('php://input');
$signature = 'sha1=' . hash_hmac('sha1', $payload, $secret);
if (!hash_equals($_SERVER['HTTP_X_HUB_SIGNATURE'] ?? '', $signature)) {
    http_response_code(403);
    exit('Bad signature');
}
exec(sprintf('rm -rf %s', escapeshellarg($publishDir)), $out0, $ret0);
exec(sprintf(
    '%s clone --depth=1 %s %s 2>&1',
    $git,
    escapeshellarg($repoUrl),
    escapeshellarg($publishDir)
), $out1, $ret1);
file_put_contents('/tmp/hook.log',
    date('[Y-m-d H:i:s] ') .
    "CLEANUP ret=$ret0\n"    . implode("\n", $out0) . "\n" .
    "CLONE   ret=$ret1\n"    . implode("\n", $out1) . "\n\n",
    FILE_APPEND
);
header('Content-Type: text/plain');
echo "CLEANUP (ret=$ret0):\n", implode("\n", $out0), "\n\n";
echo "CLONE   (ret=$ret1):\n", implode("\n", $out1), "\n";
