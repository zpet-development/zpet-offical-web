<?php
$servername = "localhost";
$username = "user096_zpet";
$password = "zpetrol13842004";

// Create connection
$conn = new mysqli($servername, $username, $password);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";
?>