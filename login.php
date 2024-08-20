<?php
session_start();
if (!isset($_SESSION['is_login'])) {
} else {
    header("Location: /index.php");
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <title>Chat App</title>
    <style>
        *::-webkit-scrollbar {
            display: none;
        }

        * {
            font-family: 'Poppins', sans-serif;
        }
    </style>
    <!-- // jquery  -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.0/jquery.min.js" integrity="sha512-3gJwYpMe3QewGELv8k/BX9vcqhryRdzRMxVfq6ngyWXwo03GFEzjsUm8Q7RZcHPHksttq7/GFoxjCVUjkjvPdw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

</head>

<body class="h-screen w-full dark:backdrop-invert bg-[url('img/background/AbstractPaper.svg')] bg-center bg-cover bg-no-repeat">
    <div class="flex min-h-full flex-col justify-center py-12 px-8 my-auto">
        <div class="bg-white w-[40%] mx-auto rounded-3xl py-5">
            <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                <img class="mx-auto h-16 w-16 rounded-full" src="img/background/AbstractPaper.svg" alt="Your Company">
                <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your
                    account
                </h2>
            </div>

            <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <div>
                    <div>
                        <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Username</label>
                        <div class="mt-2">
                            <input id="username" type="text" required placeholder="Your username" class="block w-full rounded-md px-5 py-1.5 outline-none text-gray-900 shadow-sm border-2 border-inset border-gray-300 placeholder:text-gray-400 focus:border-2 focus:border-inset focus:border-gray-600 sm:text-sm sm:leading-6">
                        </div>
                    </div>

                    <div>
                        <div class="flex items-center justify-between">
                            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
                        </div>
                        <div class="mt-2">
                            <input id="password" name="password" type="password" autocomplete="current-password" required placeholder="Your password" class="block w-full rounded-md px-5 py-1.5 outline-none text-gray-900 shadow-sm border-2 border-inset border-gray-300 placeholder:text-gray-400 focus:border-2 focus:border-inset focus:border-gray-600 sm:text-sm sm:leading-6">
                        </div>
                    </div>

                    <div class="mt-5">
                        <button id="submit" class="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">Sign
                            in</button>
                    </div>
                </div>

                <p class="mt-10 text-center text-sm text-gray-500">
                    Not a member?
                    <a href="register.php" class="font-semibold leading-6 text-gray-600 hover:text-indigo-500">Make free
                        account</a>
                </p>
            </div>
        </div>
    </div>




    <script src="login.js"></script>


</body>

</html>