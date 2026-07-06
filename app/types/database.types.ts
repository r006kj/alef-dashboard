export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      clientes: {
        Row: {
          id: string
          created_at: string
          user_id: string
          nombre: string
          telefono: string | null
          email: string | null
          documento: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id?: string
          nombre: string
          telefono?: string | null
          email?: string | null
          documento?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          nombre?: string
          telefono?: string | null
          email?: string | null
          documento?: string | null
        }
        Relationships: []
      }
      citas: {
        Row: {
          id: string
          created_at: string
          cliente_id: string
          fecha: string
          hora: string
          servicio: string
          estado: string
        }
        Insert: {
          id?: string
          created_at?: string
          cliente_id: string
          fecha: string
          hora: string
          servicio: string
          estado?: string
        }
        Update: {
          id?: string
          created_at?: string
          cliente_id?: string
          fecha?: string
          hora?: string
          servicio?: string
          estado?: string
        }
        Relationships: [
          {
            foreignKeyName: 'citas_cliente_id_fkey'
            columns: ['cliente_id']
            isOneToOne: false
            referencedRelation: 'clientes'
            referencedColumns: ['id']
          },
        ]
      }
      cotizaciones: {
        Row: {
          id: string
          created_at: string
          fecha: string
          total: number
        }
        Insert: {
          id?: string
          created_at?: string
          fecha: string
          total: number
        }
        Update: {
          id?: string
          created_at?: string
          fecha?: string
          total?: number
        }
        Relationships: []
      }
    }
    Views: Record<never, never>
    Functions: Record<never, never>
    Enums: Record<never, never>
    CompositeTypes: Record<never, never>
  }
}
