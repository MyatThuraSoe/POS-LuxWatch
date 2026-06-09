import { UseFormRegister, FieldErrors } from "react-hook-form";
import type { CreateProductPayload, ProductType } from "../../types/product";

interface TypeSpecificFieldsProps {
  productType: ProductType;
  register: UseFormRegister<CreateProductPayload>;
  errors: FieldErrors<CreateProductPayload>;
}

export const TypeSpecificFields = ({ productType, register, errors }: TypeSpecificFieldsProps) => {
  if (productType === "classic") {
    return (
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
          <h4 className="font-semibold text-blue-800">Classic Watch Specifications</h4>
          <p className="text-sm text-blue-600">Enter details specific to traditional watches</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Model Number</label>
            <input
              type="text"
              {...register("model_number")}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Movement Type</label>
            <select {...register("movement_type")} className="w-full rounded-md border border-gray-300 px-3 py-2">
              <option value="">Select Movement</option>
              <option value="quartz">Quartz</option>
              <option value="mechanical">Mechanical</option>
              <option value="automatic">Automatic</option>
              <option value="digital">Digital</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Case Material</label>
            <input
              type="text"
              {...register("case_material")}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="e.g., Stainless Steel, Gold"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Crystal Type</label>
            <input
              type="text"
              {...register("crystal_type")}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="e.g., Sapphire, Mineral"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Case Diameter (mm)</label>
            <input
              type="number"
              {...register("case_diameter_mm", { valueAsNumber: true })}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Case Thickness (mm)</label>
            <input
              type="number"
              {...register("case_thickness_mm", { valueAsNumber: true })}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Water Resistance (m)</label>
            <input
              type="number"
              {...register("water_resistance_meters", { valueAsNumber: true })}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Band Material</label>
            <input
              type="text"
              {...register("band_material")}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="e.g., Leather, Steel"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Band Width (mm)</label>
            <input
              type="number"
              {...register("band_width_mm", { valueAsNumber: true })}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Warranty (months)</label>
          <input
            type="number"
            {...register("warranty_months", { valueAsNumber: true })}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
      </div>
    );
  }

  // Smart Watch Fields
  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
        <h4 className="font-semibold text-green-800">Smart Watch Specifications</h4>
        <p className="text-sm text-green-600">Enter details specific to smart watches</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Operating System</label>
          <input
            type="text"
            {...register("os")}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="e.g., watchOS, Wear OS"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Display Type</label>
          <input
            type="text"
            {...register("display_type")}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="e.g., AMOLED, LCD"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Display Size (inches)</label>
          <input
            type="number"
            step="0.1"
            {...register("display_size_inches", { valueAsNumber: true })}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Battery Life (days)</label>
          <input
            type="number"
            {...register("battery_life_days", { valueAsNumber: true })}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Connectivity</label>
        <div className="grid grid-cols-3 gap-2">
          {["Bluetooth", "WiFi", "Cellular", "NFC", "GPS"].map((conn) => (
            <label key={conn} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={conn}
                {...register("connectivity")}
                className="rounded border-gray-300"
              />
              <span className="text-sm">{conn}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Sensors</label>
        <div className="grid grid-cols-3 gap-2">
          {["Heart Rate", "SpO2", "Accelerometer", "Gyroscope", "Barometer", "Compass"].map((sensor) => (
            <label key={sensor} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={sensor}
                {...register("sensors")}
                className="rounded border-gray-300"
              />
              <span className="text-sm">{sensor}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Compatible With</label>
        <div className="grid grid-cols-2 gap-2">
          {["iOS", "Android", "Windows"].map((platform) => (
            <label key={platform} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={platform}
                {...register("compatible_with")}
                className="rounded border-gray-300"
              />
              <span className="text-sm">{platform}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("heart_rate_monitor")}
            className="rounded border-gray-300"
          />
          <span className="text-sm">Heart Rate Monitor</span>
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("gps")} className="rounded border-gray-300" />
          <span className="text-sm">GPS</span>
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("nfc")} className="rounded border-gray-300" />
          <span className="text-sm">NFC</span>
        </label>
      </div>
    </div>
  );
};
