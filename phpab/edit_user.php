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

// 获取要编辑的用户ID
$id = intval($_GET['id']);

// 查询用户信息
$sql = "SELECT * FROM firstusers WHERE id = $id";
$result = $conn->query($sql);
$user = $result->fetch_assoc();

if (!$user) {
    die("用户不存在");
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>编辑用户</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f7f9fc;
            margin: 0;
            padding: 0;
            line-height: 1.6;
            color: #333;
        }

        .container {
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background-color: #fff;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
        }

        h1 {
            font-size: 2rem;
            text-align: center;
            color: #2c3e50;
        }

        .user-form {
            display: flex;
            flex-direction: column; /* 垂直排列 */
        }

        .user-form input {
            padding: 10px;
            font-size: 1rem;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin-bottom: 10px; /* 输入框间距 */
        }

        .user-form button {
            padding: 10px;
            background-color: #2980b9;
            color: #fff;
            font-size: 1rem;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        .user-form button:hover {
            background-color: #3498db;
        }

        footer {
            text-align: center;
            margin-top: 20px;
            color: #999;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>

<div class="container">
    <h1>编辑用户信息</h1>

    <!-- 编辑用户表单 -->
    <form action="update_user.php" method="POST" class="user-form">
        <input type="hidden" name="id" value="<?php echo $user['id']; ?>"> <!-- 隐藏用户ID -->
        <input type="text" name="name" placeholder="输入名字" value="<?php echo htmlspecialchars($user['name']); ?>" required>
        <input type="text" name="student_id" placeholder="输入学号" value="<?php echo htmlspecialchars($user['student_id']); ?>" required>
        <input type="text" name="major" placeholder="输入专业" value="<?php echo htmlspecialchars($user['major']); ?>" required>
        <button type="submit">更新用户</button>
    </form>
</div>

<footer>
    &copy; 2024 用户管理系统
</footer>

</body>
</html>

<?php
$conn->close();
?>

