# Alef Dashboard

Mini-dashboard interno de gestión (clientes, citas y métricas).

 **Demo:** https://alef-dashboard-omega.vercel.app
---

## Funcionalidades

**Nivel 1 (completo)**
- Autenticación con Supabase Auth (email/contraseña) y rutas protegidas: sin sesión, redirige al login.
- **Clientes** — CRUD completo (crear, listar, editar, eliminar) con buscador por nombre.
- **Citas** — agendar (cliente, fecha, hora, servicio) y ver las citas del día.
- **Dashboard** — tarjetas de métricas (total de clientes, citas de hoy, ventas del mes) y gráfico de citas por día.
- **Anti-doble-agendamiento** — no permite dos citas a la misma fecha y hora (resuelto en base de datos, ver abajo).

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Nuxt 4 (SPA, `ssr: false`) + Vue 3 (Composition API) |
| UI | Vuetify 3 |
| Backend / BD | Supabase (PostgreSQL + Auth) |
| Seguridad | Row Level Security (RLS) |
| Despliegue | Vercel |

---

## Requisitos

- Node.js ≥ 20
- Una cuenta y proyecto en [Supabase](https://supabase.com)

## Instalación

```bash
git clone https://github.com/r006kj/alef-dashboard.git
cd alef-dashboard
npm install
```

Crea un archivo `.env` en la raíz (ver `.env.example`):

```bash
SUPABASE_URL="https://TU-PROYECTO.supabase.co"
SUPABASE_KEY="TU_ANON_KEY"
```

> `SUPABASE_KEY` es la **anon key** (pública). Protegida por el RLS

## Base de datos

Corre este SQL en el **SQL Editor** de Supabase:

\\sql
-- TABLAS
create table clientes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  nombre text not null,
  telefono text,
  email text,
  documento text,
  created_at timestamptz default now()
);

create table citas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  cliente_id uuid not null,
  fecha date not null,
  hora time not null,
  servicio text not null,
  estado text default 'agendada',
  created_at timestamptz default now()
);

-- CONSTRAINTS
alter table clientes add constraint clientes_user_id_fk
  foreign key (user_id) references auth.users(id) on delete cascade;
alter table citas add constraint citas_user_id_fk
  foreign key (user_id) references auth.users(id) on delete cascade;
alter table citas add constraint citas_cliente_id_fk
  foreign key (cliente_id) references clientes(id) on delete cascade;
alter table citas add constraint citas_fecha_hora_unica
  unique (fecha, hora);

-- RLS
alter table clientes enable row level security;
alter table citas enable row level security;

create policy "own_clientes" on clientes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own_citas" on citas
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
\\

En **Authentication → Providers → Email**, desactiva "Confirm email" para probar sin verificación de correo, o confirma los usuarios manualmente en **Authentication → Users**.

## Ejecutar

```bash
npm run dev
```

Abre `http://localhost:3000`, regístrate/inicia sesión y accede al dashboard.

---

## Cómo resolví el doble agendamiento

La solución está en la base de datos: una restricción **`UNIQUE(fecha, hora)`** en la tabla `citas`. PostgreSQL serializa los inserts sobre el índice único, así que ante peticiones concurrentes solo una gana y la otra recibe una violación de unicidad (código `23505`). En la aplicación no repito la validación: intento el insert y capturo ese código para mostrar *"ese horario ya está ocupado"*.

```ts
const { error } = await supabase.from('citas').insert({ ...form.value })
if (error) {
  error.value = error.code === '23505'
    ? 'Ese horario ya está ocupado. Elige otra hora.'
    : error.message
}
```

## Qué dejaría para una siguiente versión

- Adaptar el `UNIQUE` a `(user_id, fecha, hora)` si cada profesional maneja su propia agenda.
- Manejar rangos para bloquear solapamientos de citas de distinta duración, no solo choques exactos.
- Vista de citas por rango de fechas, no solo del día.

## Decisiones de diseño

- **SPA (`ssr: false`)** — es una herramienta interna detrás de login, sin necesidad de SEO; SSR solo agregaría complejidad y dificulta el despliegue estático.
- **RLS desde el Nivel 1** — cada usuario solo accede a sus propios datos; por eso la anon key puede vivir en el cliente sin riesgo.