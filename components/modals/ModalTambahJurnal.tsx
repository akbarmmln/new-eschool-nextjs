'use client'

import {
  useState,
} from 'react'
import JournalEditor from '@/components/common/Editor'
import CustomDatePicker from '@/components/common/DatePicker'

type Props = {
  onClose: () => void
}

export default function ModalTambahJurnal({
  onClose,
}: Props) {
  const [materiPembelajaran, setMateriPembelajaran] = useState('')
  const [refleksiPembelajaran, setRefleksiPembelajaran] = useState('')

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

      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(17,24,39,.45);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          font-family: 'font-plus-jakarta';
        }

        .modal-card {
          scroll-behavior: auto;
          width: min(920px, 92vw);
          max-width: 980px;
          max-height: 95vh;
          border-radius: 15px;
          background: #fff;
          box-shadow: 0 25px 60px rgba(0,0,0,.18);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .modal-header {
          min-height: 72px;
          padding: 0 34px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e5e7eb;
          background: #fff;
          position: sticky;
          top: 0;
          z-index: 20;
          flex-shrink: 0;
        }

        .modal-header h1 {
          margin: 0;
          font-size: clamp(20px, 4vw, 22px);
          font-weight: 700;
          color: #1e293b;
        }

        .close-btn {
          width: 35px;
          height: 35px;
          border-radius: 999px;
          border: none;
          background: #9ca3af;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn i {
          font-size: 20px;
        }

        .modal-body {
          overscroll-behavior: contain;
           padding: 24px;
           overflow-y: auto;
           flex: 1;
           scrollbar-width: none;
           -ms-overflow-style: none;
        }

        .modal-body::-webkit-scrollbar {
          display: none;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          margin-bottom: 15px;
        }

        .form-group label {
          margin-bottom: 14px;
          font-size: 18px;
          color: #1e293b;
        }

        .input-modern {
          width: 100%;
          height: 55px;
          border-radius: 10px;
          border: 1px solid #dbe1ea;
          background: #fff;
          padding: 0 58px 0 22px;
          font-size: 18px;
          font-weight: 500;
          color: #1e293b;
          outline: none;
          transition: all .2s ease;
        }

        .input-modern:focus {
          border-color: #5b7fff;
          box-shadow: 0 0 0 3px rgba(91,127,255,.12);
        }

        .time-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .editor-box {
          border: 1px solid #dbe1ea;
          border-radius: 10px;
          overflow: hidden;
          background: #fff;
        }

        .editor-toolbar {
          min-height: 52px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }

        .toolbar-left,
        .toolbar-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .editor-toolbar select {
          height: 48px;
          border-radius: 14px;
          border: 1px solid #e5e7eb;
          padding: 0 14px;
          font-size: 18px;
        }

        .editor-toolbar button {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 22px;
          color: #1e293b;
        }

        .footer-action {
          display: flex;
          justify-content: flex-end;
          gap: 14px;
          margin-top: 15px;
        }

        .btn-cancel,
        .btn-save {
          height: 35px;
          padding: 0 26px;
          border-radius: 10px;
          border: none;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-cancel {
          background: #eef2ff;
          color: #4f46e5;
        }

        .btn-save {
          background: linear-gradient(90deg,#5b7fff 0%,#696cff 100%);
          color: #fff;
          box-shadow: 0 12px 28px rgba(91,127,255,.28);
        }

        @media (max-width: 768px) {       
          .modal-card {

            width: 95vw;

            max-height: 92vh;

            border-radius: 18px;
          }
          .input-modern,
          .input-icon input,
          .input-icon select {

            height: 52px;

            font-size: 16px;
          }
          .modal-header {
            height: auto;
            padding: 24px;
          }

          .modal-body {
            padding: 18px;
          }

          .time-grid {
            grid-template-columns: 1fr;
          }

          .form-group label {
            font-size: 18px;
          }

          .input-icon input,
          .input-icon select {
            height: 55px;
            font-size: 18px;
          }

          textarea {
            min-height: 220px;
            font-size: 18px;
          }

          .footer-action {
            flex-direction: column;
          }

          .btn-cancel,
          .btn-save {
            width: 100%;
          }
        }

      `}</style>
    </>
  )
}