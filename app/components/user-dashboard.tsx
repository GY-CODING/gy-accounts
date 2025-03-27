/* eslint-disable @next/next/no-html-link-for-pages */
"use client"

import { useUser } from "@auth0/nextjs-auth0/client"
import { useState } from "react"
import { ThemeSwitch } from "./theme-switch"
import Image from "next/image"
import { lexendFont, valorantFont } from "../utils/fonts"
import { ProfileSkeleton } from "./profile-skeleton"
import { UserUpdateData } from "../types/user"
import { RoleChip } from "./role-chip"
import { Phone, Mail } from "lucide-react"
import { useGycodingUser } from "../hooks/useGycodingUser"
import { toBase64 } from "../utils/global"

export function UserDashboard() {
  const { user, isLoading: auth0Loading } = useUser()
  const { data: gyUser, isLoading: gyUserLoading, error: userError, update, isLoadingUpdate } = useGycodingUser()
  const [isEditing, setIsEditing] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageKey, setImageKey] = useState(Date.now());

  const [editData, setEditData] = useState<UserUpdateData>({
    username: gyUser?.username || "",
    picture: gyUser?.picture || "",
    phoneNumber: gyUser?.phoneNumber || null
  })

  const handleEditClick = () => {
    setEditData({
      username: gyUser?.username || "",
      picture: gyUser?.picture || "",
      phoneNumber: gyUser?.phoneNumber || null
    })
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditData({
      username: "",
      picture: "",
      phoneNumber: null
    })
  }

  const handleSaveEdit = async () => {
    try {
      let base64Image = editData.picture; // Mantener la imagen actual si no se cambia

      if (imageFile) {
        base64Image = await toBase64(imageFile); // Convertir la nueva imagen a Base64
      }

      const updatedData: UserUpdateData = {
        ...editData,
        picture: base64Image, // Usar la nueva imagen en Base64
      };

      await update(updatedData); // Mandar la data actualizada a la API

      // Actualizar imagen con el timestamp para evitar cache
      setImageKey(Date.now()); // Forzar la recarga de la imagen con el timestamp

      setPreviewImage(null); // Resetear la vista previa después de guardar
    } catch (error) {
      console.error("Error updating user data:", error);
    }

    setIsEditing(false);
  };




  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      // Crear una URL de objeto para vista previa
      const objectUrl = URL.createObjectURL(file);

      setPreviewImage(objectUrl); // Asegurarse de que se actualiza correctamente

      // También actualizar editData.picture para evitar problemas
      setEditData((prev) => ({
        ...prev,
        picture: objectUrl,
      }));
    }
  };


  if (auth0Loading || gyUserLoading) {
    return (
      <div className="min-h-screen bg-background">
        <ProfileSkeleton />
      </div>
    )
  }

  if (!gyUser) {
    return (
      <div className="min-h-screen bg-background">
        <p className={`${lexendFont.className} text-lg`}>No user data available</p>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-background ${lexendFont.className}`}>
      {/* Header con logo */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/gycoding.svg"
                alt="GY Accounts"
                width={32}
                height={32}
                priority
              />
              <h1 className={`${valorantFont.className} text-xl font-bold`}>Gy ACCOUNTS</h1>
            </div>
            <ThemeSwitch />
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4">
        {/* {isLoadingUpdate && <Spinner />} */}
        <div className="bg-card rounded-lg shadow-lg overflow-hidden">
          {/* Header con foto de perfil y nombre */}
          <div className="relative h-32 bg-gradient-to-r from-primary to-primary/60">
            <div className="absolute -bottom-16 left-8">
              <div className="relative h-32 w-32 rounded-full border-4 border-background overflow-hidden">
                <Image
                  loader={({ src }) => src}
                  src={previewImage || editData.picture || gyUser?.picture || "/default.png"}
                  alt="Profile Picture"
                  fill
                  sizes="(max-width: 128px) 100vw, 128px"
                  priority
                  className="object-cover"
                />



                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <label className="cursor-pointer text-white text-sm">
                      Change
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-20 px-8 pb-8">
            {/* Información del usuario */}
            <div className="space-y-6">
              {/* Nombre y username */}
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.username}
                    onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                    className={`${lexendFont.className} text-3xl font-bold bg-transparent border-b border-primary focus:outline-none focus:border-primary/90 w-full`}
                    placeholder="Enter username"
                  />
                ) : (
                  <h1 className={`${lexendFont.className} text-3xl font-bold text-foreground`}>
                    {gyUser.username}
                  </h1>
                )}
              </div>

              {/* Detalles de contacto */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className={lexendFont.className}>{user?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phoneNumber || ""}
                      onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value || null })}
                      className={`${lexendFont.className} bg-transparent border-b border-primary focus:outline-none focus:border-primary/90 w-full`}
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <span className={lexendFont.className}>{gyUser.phoneNumber || "No phone number"}</span>
                  )}
                </div>
              </div>

              {/* Roles */}
              <div>
                <h2 className={`${lexendFont.className} text-lg font-semibold mb-2 text-foreground`}>Roles</h2>
                <div className="flex flex-wrap gap-2">
                  {gyUser.roles?.map((role) => (
                    <RoleChip key={role} role={role} />
                  ))}
                </div>
              </div>

              {/* Acciones */}
              <div className="flex justify-between items-center pt-6 mt-6 border-t">
                {isEditing ? (
                  <div className="flex gap-4">
                    <button
                      onClick={handleSaveEdit}
                      disabled={isLoadingUpdate}
                      className={`px-4 py-2 ${isLoadingUpdate ? 'bg-gray-700 pointer-events-none' : 'bg-primary'} dark:text-black text-white rounded-lg hover:bg-primary/90 transition-colors`}
                    >
                      {isLoadingUpdate ? "Loading..." : "Save changes"}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-red-500 text-black rounded-lg hover:bg-destructive/90 dark:text-black text-white transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleEditClick}
                    className="px-4 py-2 bg-primary dark:text-black text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
                <a
                  href="/api/auth/logout"
                  className="px-4 py-2 text-red-500 hover:text-destructive/90 transition-colors"
                >
                  Logout
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
