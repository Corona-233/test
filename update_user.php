<?php
// 连接到数据库
$servername = "localhost";
$username = "corona";
$password = "123456";
$dbname = "firstdb";

$conn = new mysqli($servername, $username, $password, $dbname);

// 检查连接
if ($conn->connect_error) {
    die("连接失败: " . $conn->connect_error);
}

// 获取表单数据
$id = intval($_POST['id']);
$name = $conn->real_escape_string(trim($_POST['name']));
$student_id = $conn->real_escape_string(trim($_POST['student_id']));
$major = $conn->real_escape_string(trim($_POST['major']));

// 更新用户信息
$sql = "UPDATE firstusers SET name='$name', student_id='$student_id', major='$major' WHERE id=$id";

if ($conn->query($sql) === TRUE) {
    echo "用户信息更新成功！";
} else {
    echo "更新用户信息时出错: " . $conn->error;
}

// 关闭连接
$conn->close();

// 重定向回用户列表
header("Location: index.php");
exit();
?>

