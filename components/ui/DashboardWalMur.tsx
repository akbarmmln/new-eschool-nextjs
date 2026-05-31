"use client";

export default function DashboardClientWalMur() {
  return (
    <>
      <div
        style={{
          display: 'grid',
          gap: 24,
          marginTop: 20,
        }}
      >
        {/* TOP */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              '2fr 1fr 1fr',
            gap: 24,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 24,
              padding: 30,
              minHeight: 260,
            }}
          >
            <h1>
              Congratulations John! 🎉
            </h1>

            <p
              style={{
                fontSize: 18,
                color: '#6b7280',
              }}
            >
              You have done 68% 😎
              more sales today.
            </p>

            <button
              style={{
                marginTop: 20,
                border: 'none',
                background:
                  '#696cff',
                color: '#fff',
                height: 52,
                padding:
                  '0 24px',
                borderRadius: 14,
                fontWeight: 600,
              }}
            >
              View Profile
            </button>
          </div>

          <div
            style={{
              background: '#fff',
              borderRadius: 24,
              minHeight: 260,
            }}
          />

          <div
            style={{
              background: '#fff',
              borderRadius: 24,
              minHeight: 260,
            }}
          />
        </div>

        {/* BOTTOM */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              '2fr 1fr',
            gap: 24,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 24,
              minHeight: 400,
            }}
          />

          <div
            style={{
              background: '#fff',
              borderRadius: 24,
              minHeight: 400,
            }}
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              '2fr 1fr',
            gap: 24,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 24,
              minHeight: 400,
            }}
          />

          <div
            style={{
              background: '#fff',
              borderRadius: 24,
              minHeight: 400,
            }}
          />
        </div>
      </div>
    </>
  );
}