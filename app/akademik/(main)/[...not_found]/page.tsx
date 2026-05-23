'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePreviousRoute } from '@/app/providers'

export default function NotFoundSite() {
  const router = useRouter();
  const previousRoute = usePreviousRoute();

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f4f5fb',
        padding: 24,
      }} >

      <div
        style={{
          width: '100%',
          maxWidth: 1100,
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 40,
          alignItems: 'center',
        }} >

        {/* LEFT */}
        <div>
          {/* LABEL */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(105,108,255,.1)',
              color: '#696cff',
              padding: '10px 16px',
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 14,
              marginBottom: 24,
            }} >
            <i className="ri-error-warning-line" />
            Error 404
          </div>

          {/* TITLE */}
          <h1
            style={{
              fontSize: 'clamp(44px, 8vw, 82px)',
              lineHeight: 1,
              margin: 0,
              fontWeight: 800,
              color: '#2a3547',
              letterSpacing: '-3px',
            }} >
            Oops!
          </h1>

          <h2
            style={{
              marginTop: 16,
              marginBottom: 18,
              fontSize: 'clamp(24px, 4vw, 38px)',
              lineHeight: 1.2,
              color: '#2a3547',
              fontWeight: 700,
              letterSpacing: '-1px',
            }} >
            Halaman tidak ditemukan
          </h2>

          {/* DESCRIPTION */}
          <p
            style={{
              color: '#6b7280',
              fontSize: 17,
              lineHeight: 1.8,
              maxWidth: 520,
              marginBottom: 34,
            }} >
            Halaman yang Anda cari mungkin telah dipindahkan,
            dihapus, atau URL yang dimasukkan tidak benar.
          </p>

          {/* ACTIONS */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 14,
            }} >

            <Link
              href="/akademik/dashboard"
              style={{
                height: 52,
                padding: '0 24px',
                borderRadius: 16,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                background:
                  'linear-gradient(90deg,#5d87ff 0%, #696cff 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 15,
                boxShadow:
                  '0 10px 24px rgba(105,108,255,.25)',
              }} >
              <i
                className="ri-home-5-line"
                style={{
                  marginRight: 10,
                  fontSize: 20,
                }}
              />
              Kembali ke Beranda
            </Link>

            {/* <button
              onClick={() => router.push(previousRoute)}
              style={{
                height: 52,
                padding: '0 24px',
                borderRadius: 16,
                border: '1px solid #dfe3f1',
                background: '#fff',
                color: '#2a3547',
                fontWeight: 700,
                fontSize: 15,
                cursor: 'pointer',
              }} >
              <i
                className="ri-arrow-left-line"
                style={{
                  marginRight: 10,
                  fontSize: 20,
                }}
              />
              Kembali
            </button> */}
          </div>
        </div>

        {/* RIGHT ILLUSTRATION */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }} >

          {/* GLOW */}
          <div
            style={{
              position: 'absolute',
              width: 360,
              height: 360,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(105,108,255,.18) 0%, rgba(105,108,255,0) 70%)',
              filter: 'blur(12px)',
            }}
          />

          {/* CARD */}
          <div
            style={{
              width: '100%',
              maxWidth: 420,
              borderRadius: 32,
              background: 'rgba(255,255,255,.7)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              padding: 36,
              boxShadow:
                '0 20px 50px rgba(0,0,0,.08)',
              border: '1px solid rgba(255,255,255,.6)',
              position: 'relative',
              overflow: 'hidden',
            }} >

            {/* FLOAT ICON */}
            <div
              style={{
                position: 'absolute',
                top: 18,
                right: 18,
                width: 54,
                height: 54,
                borderRadius: 18,
                background:
                  'linear-gradient(135deg,#5d87ff 0%,#696cff 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 28,
                boxShadow:
                  '0 10px 25px rgba(105,108,255,.25)',
              }} >
              <i className="ri-emotion-sad-line" />
            </div>

            {/* ILLUSTRATION */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
                marginBottom: 28,
              }} >
              <img
                src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
                alt="404"
                style={{
                  width: '100%',
                  maxWidth: 240,
                  objectFit: 'contain',
                }}
              />
            </div>

            {/* CODE */}
            <div
              style={{
                textAlign: 'center',
              }} >

              <div
                style={{
                  fontSize: 82,
                  fontWeight: 800,
                  lineHeight: 1,
                  letterSpacing: '-5px',
                  background:
                    'linear-gradient(90deg,#5d87ff 0%,#696cff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }} >
                404
              </div>

              <div
                style={{
                  marginTop: 10,
                  color: '#6b7280',
                  fontWeight: 600,
                  fontSize: 16,
                }} >
                Page Not Found
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}