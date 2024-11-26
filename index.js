import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

// Konfigurasi path untuk mendukung module ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware untuk parsing JSON dan URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware untuk menyajikan file statis dari folder "public"
app.use(express.static('public'));

// Array untuk menyimpan akun-akun yang dibuat
const users = [];

// Endpoint default untuk login
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Login</title>
        <link rel="stylesheet" type="text/css" href="/style.css">
      </head>
      <body class="login-page">
        <div class="login-container">
          <h1>Login</h1>
          <form action="/login" method="POST">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required><br><br>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required><br><br>
            <label>
              <input type="checkbox" id="show-password"> Show Password
            </label><br><br>
            <button type="submit" class="login-button">Login</button>
          </form>
          <p>Belum punya akun? <a href="/create-account">Create Account</a></p>
        </div>
        <script>
          const showPasswordCheckbox = document.getElementById('show-password');
          const passwordField = document.getElementById('password');
          showPasswordCheckbox.addEventListener('change', () => {
            if (showPasswordCheckbox.checked) {
              passwordField.type = 'text';
            } else {
              passwordField.type = 'password';
            }
          });
        </script>
      </body>
    </html>
  `);
});

// Endpoint untuk form "Create Account"
app.get('/create-account', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Create Account</title>
        <link rel="stylesheet" type="text/css" href="/style.css">
      </head>
      <body class="create-account-page">
        <div class="create-account-container">
          <h1>Create Account</h1>
          <form action="/create-account" method="POST">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required><br><br>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required><br><br>
            <label for="confirm-password">Confirm Password:</label>
            <input type="password" id="confirm-password" name="confirmPassword" required><br><br>
            <label>
              <input type="checkbox" id="show-password-create"> Show Password
            </label><br><br>
            <button type="submit" class="save-button">Save</button>
          </form>
        </div>
        <script>
          const showPasswordCreateCheckbox = document.getElementById('show-password-create');
          const passwordFieldCreate = document.getElementById('password');
          const confirmPasswordFieldCreate = document.getElementById('confirm-password');
          
          showPasswordCreateCheckbox.addEventListener('change', () => {
            if (showPasswordCreateCheckbox.checked) {
              passwordFieldCreate.type = 'text';
              confirmPasswordFieldCreate.type = 'text';
            } else {
              passwordFieldCreate.type = 'password';
              confirmPasswordFieldCreate.type = 'password';
            }
          });
        </script>
      </body>
    </html>
  `);
});

// Endpoint untuk menangani pembuatan akun
app.post('/create-account', (req, res) => {
  const { email, password, confirmPassword } = req.body;

  // Validasi input
  if (password !== confirmPassword) {
    res.send('Passwords do not match!');
  } else {
    // Simpan akun baru di array
    users.push({ email, password });
    console.log(`Account created for email: ${email}`);
    
    res.send(`
      <html>
        <head>
          <title>Account Created</title>
        </head>
        <body>
          <h1>Selamat! Akun Kamu berhasil dibuat.</h1>
          <p>Silahkan login kembali.</p>
          <p>Anda akan dialihkan ke halaman login dalam 3 detik...</p>
          <script>
            setTimeout(() => {
              window.location.href = '/';
            }, 3000); // 3000ms = 3 detik
          </script>
        </body>
      </html>
    `);
  }
});

// Endpoint untuk login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Validasi login
  const user = users.find(user => user.email === email && user.password === password);
  if (user) {
    res.redirect('/dashboard');
  } else {
    res.send('Invalid email or password!');
  }
});

// Endpoint untuk dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
