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

// 查询所有用户
$sql = "SELECT * FROM firstusers";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>用户管理系统</title>
    <link rel="stylesheet" href="style.css"> <!-- 引入自定义的 CSS -->
</head>
<body>

<div class="container">
    <h1>用户管理系统</h1>

    <!-- 表单：新增用户 -->
    <form action="save_user.php" method="POST" class="user-form">
        <input type="text" name="name" placeholder="输入名字" required>
        <input type="text" name="student_id" placeholder="输入学号" required>
        <input type="text" name="major" placeholder="输入专业" required>
        <button type="submit">新增用户</button>
    </form>

    <h2>用户列表</h2>
    <ul>
        <?php
        if ($result->num_rows > 0) {
            // 输出用户列表
            while ($row = $result->fetch_assoc()) {
                echo "<li>" . htmlspecialchars($row['name']) . " - 学号: " . htmlspecialchars($row['student_id']) . " - 专业: " . htmlspecialchars($row['major']) . "
                <div class='action-buttons'>
                    <a href='edit_user.php?id=" . $row['id'] . "'>编辑</a>
                    <a href='delete_user.php?id=" . $row['id'] . "' onclick='return confirm(\"确定删除?\")'>删除</a>
                </div>
                </li>";
            }
        } else {
            echo "<li>没有用户</li>";
        }
        ?>
    </ul>
</div>

<footer>
    &copy; By XYS
</footer>

<?php
$conn->close();
?>
</body>
</html>

