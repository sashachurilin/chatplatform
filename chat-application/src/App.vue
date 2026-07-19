<template>
  <div class="container">
    <div class="form-box">
      <h2>Регистрация</h2>
      
      <div class="form-group">
        <input 
          type="text" 
          v-model="form.username" 
          placeholder="Имя пользователя"
        />
      </div>
      
      <div class="form-group">
        <input 
          type="email" 
          v-model="form.email" 
          placeholder="Email"
        />
      </div>
      
      <div class="form-group">
        <input 
          type="password" 
          v-model="form.password" 
          placeholder="Пароль"
        />
      </div>
      
      <div class="form-group">
        <input 
          type="password" 
          v-model="form.confirmPassword" 
          placeholder="Подтвердите пароль"
        />
      </div>
      
      <button @click="register" :disabled="loading">
        {{ loading ? 'Загрузка...' : 'Зарегистрироваться' }}
      </button>
      
      <p v-if="message" :class="['message', messageType]">
        {{ message }}
      </p>
      
      <div class="links">
        <a href="#">Уже есть аккаунт? Войти</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const message = ref('')
const messageType = ref('')

const register = async () => {
  if (!form.username || !form.email || !form.password) {
    message.value = 'Заполните все поля'
    messageType.value = 'error'
    return
  }
  
  if (form.password !== form.confirmPassword) {
    message.value = 'Пароли не совпадают'
    messageType.value = 'error'
    return
  }
  
  loading.value = true
  message.value = ''
  
  try {
    const response = await axios.post('/api/auth/register', {
      username: form.username,
      email: form.email,
      password: form.password
    })
    
    message.value = '✅ Регистрация прошла успешно!'
    messageType.value = 'success'
    
    form.username = ''
    form.email = ''
    form.password = ''
    form.confirmPassword = ''
    
  } catch (error) {
    const msg = error.response?.data?.message || 'Ошибка регистрации'
    message.value = '❌ ' + msg
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f0f2f5;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.form-box {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  color: #1a1a2e;
  margin-bottom: 30px;
  font-weight: 600;
}

.form-group {
  margin-bottom: 16px;
}

input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #4a90d9;
}

button {
  width: 100%;
  padding: 12px;
  background: #4a90d9;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 8px;
}

button:hover:not(:disabled) {
  background: #357abd;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.message {
  margin-top: 16px;
  padding: 10px;
  border-radius: 6px;
  text-align: center;
  font-size: 14px;
}

.message.success {
  background: #d4edda;
  color: #155724;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
}

.links {
  margin-top: 20px;
  text-align: center;
}

.links a {
  color: #4a90d9;
  text-decoration: none;
  font-size: 14px;
}

.links a:hover {
  text-decoration: underline;
}
</style>