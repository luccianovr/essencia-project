# 🚀 Deploy a Vercel

## ✅ Por qué Vercel para Next.js

- ✅ **Optimizado para Next.js** (misma empresa)
- ✅ **HTTPS automático**
- ✅ **Sin tarjeta de crédito**
- ✅ **Deploy en 2 minutos**
- ✅ **Tier gratuito generoso**
- ✅ **Edge functions globales**
- ✅ **Dominio gratis** (.vercel.app)

---

## 📋 Pasos para Deploy

### 1️⃣ Preparar el Proyecto

Primero, asegúrate de que tu código esté en GitHub:

```bash
# Si no has hecho commit
git add .
git commit -m "Preparar para deploy en Vercel"

# Si no has creado repo en GitHub, créalo y luego:
git remote add origin https://github.com/TU-USUARIO/chatbot-landing.git
git branch -M main
git push -u origin main
```

**Nota:** Si no tienes repo en GitHub, créalo en https://github.com/new

---

### 2️⃣ Crear Cuenta en Vercel

1. **Ir a:** https://vercel.com/signup
2. **Sign up with GitHub** (más fácil)
3. Autorizar Vercel a acceder a tus repos

---

### 3️⃣ Importar Proyecto

1. **Click en "Add New Project"**
2. **Import Git Repository**
3. Seleccionar tu repo `chatbot-landing`
4. **Click "Import"**

---

### 4️⃣ Configurar Variables de Entorno

Antes de hacer deploy, agregar las variables:

1. **En "Environment Variables"** agregar:

```bash
# MongoDB Atlas (tu connection string real)
MONGODB_URI=mongodb+srv://conversai_user:PASSWORD@cluster.mongodb.net/conversai?retryWrites=true&w=majority

# Resend
RESEND_API_KEY=re_tu_api_key_real
EMAIL_TO=tu-email@empresa.com
EMAIL_FROM=demo@tudominio.com

# App Config (públicas)
NEXT_PUBLIC_APP_NAME=conversAI
NEXT_PUBLIC_APP_DESCRIPTION=Agentes de IA para Servicio al Cliente
NEXT_PUBLIC_APP_URL=https://tu-proyecto.vercel.app
NEXT_PUBLIC_CONTACT_EMAIL=contacto@conversai.com
NEXT_PUBLIC_DEMO_URL=https://tu-proyecto.vercel.app/#demo

# Rate Limiting
DEMO_RATE_LIMIT_MAX=5
```

2. **Importante:** Marca como **Production, Preview, Development** las que necesites

---

### 5️⃣ Deploy

1. **Click "Deploy"**
2. ⏱️ Esperar ~2-3 minutos
3. ✅ ¡Listo!

Tu app estará en: `https://chatbot-landing-tu-usuario.vercel.app`

---

## 🔧 Configuración Post-Deploy

### Actualizar NEXT_PUBLIC_APP_URL

1. **Ve a tu proyecto en Vercel**
2. **Settings > Environment Variables**
3. **Editar `NEXT_PUBLIC_APP_URL`:**
   ```
   https://tu-dominio-real.vercel.app
   ```
4. **Redeploy:** Vercel > Deployments > ... > Redeploy

---

## 🌐 Dominio Personalizado (Opcional)

### Agregar tu dominio:

1. **Vercel Dashboard > Settings > Domains**
2. **Add Domain**
3. Ingresar `tudominio.com`
4. **Configurar DNS** según instrucciones de Vercel
5. **HTTPS automático** en ~5 minutos

---

## 📊 Monitoreo

### Ver Analytics:

- **Analytics:** Dashboard > Analytics
- **Logs:** Dashboard > Deployments > View Function Logs
- **Performance:** Speed Insights incluido

---

## 🔄 Actualizar la App

Cada vez que hagas `git push` a `main`, Vercel hace deploy automáticamente:

```bash
git add .
git commit -m "Actualización"
git push
```

**Preview deployments:** Cada PR/branch tiene su propia URL de preview

---

## 💰 Tier Gratuito

**Hobby (Free):**
- ✅ 100 GB bandwidth/mes
- ✅ Serverless Function Execution ilimitado
- ✅ HTTPS automático
- ✅ Dominios personalizados ilimitados
- ✅ 1 usuario

**Suficiente para 100,000+ visitas/mes**

---

## 🐛 Troubleshooting

### Error: "Build failed"

1. Ver logs en Vercel
2. Verificar que `pnpm build` funciona localmente
3. Verificar variables de entorno

### Error: "MongoDB connection failed"

1. Verificar `MONGODB_URI` en variables de entorno
2. Asegurar que MongoDB Atlas permite IP `0.0.0.0/0`

### Función tarda mucho

- Vercel tiene timeout de 10s (Hobby) / 60s (Pro)
- Optimizar queries de MongoDB si es necesario

---

## ✅ Checklist

- [ ] Código en GitHub
- [ ] Cuenta de Vercel creada (con GitHub)
- [ ] Proyecto importado
- [ ] Variables de entorno configuradas:
  - [ ] MONGODB_URI
  - [ ] RESEND_API_KEY
  - [ ] EMAIL_TO
  - [ ] EMAIL_FROM
  - [ ] NEXT_PUBLIC_*
- [ ] Deploy exitoso
- [ ] URL funcionando
- [ ] Formulario probado
- [ ] Email recibido
- [ ] Dominio personalizado (opcional)

---

## 📚 Referencias

- [Vercel Docs](https://vercel.com/docs)
- [Next.js en Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Environment Variables](https://vercel.com/docs/environment-variables)

---

**¡Deploy listo en minutos! 🎉**
