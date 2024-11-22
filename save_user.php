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

// 处理表单提交
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $conn->real_escape_string($_POST['name']);
    $student_id = $conn->real_escape_string($_POST['student_id']);
    $major = $conn->real_escape_string($_POST['major']);
    
    // 插入到数据库
    $sql = "INSERT INTO firstusers (name, student_id, major) VALUES ('$name', '$student_id', '$major')";

    if ($conn->query($sql) === TRUE) {
        echo "新用户已保存";
    } else {
        echo "保存用户时出错: " . $conn->error;
    }
}

// 关闭连接
$conn->close();

// 重定向回首页
header("Location: index.php");
exit();
?>

