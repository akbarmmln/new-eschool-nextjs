'use client'

import {
  useState,
} from 'react'
import JournalEditor from '@/components/common/Editor'
import CustomDatePicker from '@/components/common/DatePicker'

type Props = {
  kelas: any[]
  onClose: () => void
}

export default function ModalTambahJurnal({
  kelas,
  onClose,
}: Props) {
  const [materiPembelajaran, setMateriPembelajaran] = useState('')
  const [refleksiPembelajaran, setRefleksiPembelajaran] = useState('')
  console.log('asdasdsaasd', kelas)
  const [
    tanggal,
    setTanggal,
  ] = useState<Date | null>(
    null
  )

  return (
    <>
      <div className="modal-backdrop">
        <div className="modal-card">
          <div className="modal-header">
            <h1>
              Tambah Jurnal Mengajar
            </h1>

            <button
              onClick={() =>
                onClose()
              }
              className="close-btn" >
              <i className="ri-close-line" />
            </button>
          </div>

          <div className="modal-body" >
            <div className="form-group">
              <label>
                Hari / Tanggal Mengajar
              </label>
              <CustomDatePicker
                name="tanggal_mengajar"
                value={tanggal}
                onChange={setTanggal}
              />
            </div>

            {/* KELAS */}
            <div className="form-group">
              <label>
                Kelas
              </label>

              <div className="input-icon">
                <select>
                  <option>
                    Pilih
                  </option>

                  {
                    kelas.map((item) => (
                      <option key={item.id} value={item.id} >
                        {item.nama_kelas}
                      </option>
                    ))
                  }
                </select>

                <i className="ri-arrow-down-s-line" />
              </div>
            </div>

            {/* JAM */}
            <div className="time-grid">

              {/* MULAI */}
              <div className="form-group">
                <label>
                  Jam Mulai
                </label>

                <div className="input-icon">
                  <input
                    type="text"
                    placeholder="--:--"
                  />

                  <i className="ri-time-line" />
                </div>
              </div>

              {/* SELESAI */}
              <div className="form-group">
                <label>
                  Jam Selesai
                </label>

                <div className="input-icon">
                  <input
                    type="text"
                    placeholder="--:--"
                  />

                  <i className="ri-time-line" />
                </div>
              </div>
            </div>

            {/* EDITOR */}
            <div className="form-group">
              <label>
                Materi Pembelajaran
              </label>

              <div className="editor-box">

                {/* TOOLBAR */}
                <div className="editor-toolbar">
                  <JournalEditor
                    name="materi_pembelajaran"
                    value={materiPembelajaran}
                    onChange={setMateriPembelajaran}
                  />
                </div>
              </div>
            </div>

            {/* EDITOR */}
            <div className="form-group">
              <label>
                Refleksi Pembelajaran
              </label>

              <div className="editor-box">

                {/* TOOLBAR */}
                <div className="editor-toolbar">
                  <JournalEditor
                    name="materi_pembelajaran"
                    value={refleksiPembelajaran}
                    onChange={setRefleksiPembelajaran}
                  />
                </div>
              </div>
            </div>

            {/* BUTTON */}
            <div className="footer-action">

              <button className="btn-cancel"
                onClick={() =>
                  onClose()
                } >
                Batal
              </button>

              <button className="btn-save">
                Simpan
              </button>
            </div>
          </div>
        </div>
      </div>
      <style jsx>
      {`
        .modal-backdrop {
          position: fixed;
          inset: 0;

          z-index: 999999;

          display: flex;
          align-items: center;
          justify-content: center;

          background: rgba(17, 24, 39, 0.45);
          backdrop-filter: blur(6px);
        }

        .modal-card {
          position: relative;
          z-index: 1000000;
          width: min(900px, 92vw);
          max-height: 95vh;

          display: flex;
          flex-direction: column;

          overflow: hidden;

          border-radius: 16px;
          background: #ffffff;

          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.18);
        }

        .modal-header {
          height: 72px;
          padding: 0 28px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          flex-shrink: 0;

          border-bottom: 1px solid rgba(255,255,255,.15);

          background: linear-gradient(
            90deg,
            #4f8cff 0%,
            #5b7fff 50%,
            #696cff 100%
          );

          position: relative;
        }

        .modal-header h1 {
          margin: 0;

          font-size: 22px;
          font-weight: 700;
          line-height: 1.2;

          color: #ffffff;
        }

        .close-btn {
          width: 40px;
          height: 40px;

          border: none;
          border-radius: 999px;

          display: flex;
          align-items: center;
          justify-content: center;

          background: rgba(255,255,255,.2);
          backdrop-filter: blur(6px);

          color: #ffffff;

          cursor: pointer;
          transition: all .2s ease;
        }

        .close-btn:hover {
          background: rgba(255,255,255,.3);
        }

        .close-btn i {
          font-size: 22px;
        }

        .modal-body {
          flex: 1;

          overflow-y: auto;
          overscroll-behavior: contain;

          padding: 24px;

          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .modal-body::-webkit-scrollbar {
          display: none;
        }

        .form-group {
          display: flex;
          flex-direction: column;

          margin-bottom: 20px;
        }

        .form-group label {
          margin-bottom: 10px;

          font-size: 16px;
          font-weight: 600;
          line-height: 1.4;

          color: #1e293b;
        }

        .time-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .editor-box {
          overflow: hidden;

          border: 1px solid #dbe1ea;
          border-radius: 12px;

          background: #ffffff;
        }

        .editor-toolbar {
          min-height: 54px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 16px;
          flex-wrap: wrap;

          border-bottom: 1px solid #e5e7eb;
        }

        .toolbar-left,
        .toolbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .editor-toolbar select {
          height: 42px;

          border: 1px solid #e5e7eb;
          border-radius: 10px;

          padding: 0 14px;

          font-size: 14px;

          outline: none;
        }

        .editor-toolbar button {
          width: 38px;
          height: 38px;

          border: none;
          border-radius: 10px;

          background: transparent;

          display: flex;
          align-items: center;
          justify-content: center;

          cursor: pointer;

          font-size: 18px;
          color: #1e293b;

          transition: all 0.2s ease;
        }

        .editor-toolbar button:hover {
          background: #f1f5f9;
        }

        .footer-action {
          display: flex;
          justify-content: flex-end;
          gap: 12px;

          margin-top: 28px;
        }

        .btn-cancel,
        .btn-save {
          height: 44px;
          min-width: 120px;

          padding: 0 24px;

          border: none;
          border-radius: 12px;

          font-size: 15px;
          font-weight: 700;

          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-cancel {
          background: #eef2ff;
          color: #4f46e5;
        }

        .btn-cancel:hover {
          background: #e0e7ff;
        }

        .btn-save {
          background: linear-gradient(90deg,
              #5b7fff 0%,
              #696cff 100%);

          color: #ffffff;

          box-shadow: 0 12px 28px rgba(91, 127, 255, 0.28);
        }

        .btn-save:hover {
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .modal-card {
            width: 95vw;
            max-height: 92vh;

            border-radius: 18px;
          }

          .modal-header {
            height: 68px;
            padding: 0 20px;
          }

          .modal-header h1 {
            font-size: 20px;
          }

          .modal-body {
            padding: 18px;
          }

          .time-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .form-group {
            margin-bottom: 18px;
          }

          .input-icon input,
          .input-icon select {
            height: 54px;

            font-size: 16px;
          }

          textarea {
            min-height: 220px;
            font-size: 16px;
          }

          .footer-action {
            flex-direction: column;
          }

          .btn-cancel,
          .btn-save {
            width: 100%;
          }
        }
      `}
      </style>
    </>
  )
}