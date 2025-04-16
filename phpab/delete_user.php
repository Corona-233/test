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

// 删除用户
if (isset($_GET['id'])) {
    $id = $_GET['id'];
    $sql = "DELETE FROM firstusers WHERE id=$id";

    if ($conn->query($sql) === TRUE) {
        echo "用户已删除";
    } else {
        echo "删除用户时出错: " . $conn->error;
    }
}

// 关闭连接
$conn->close();

// 重定向回首页
header("Location: index.php");
exit();
?>

