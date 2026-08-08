/**
 * Loading skeleton cards matching the flip card front face shape.
 */
export class LoadingSkeleton {
  render(count = 6) {
    const card = () => `
    <div class="skeleton-card" style="height:420px;border-radius:16px">
      <div class="space-y-4 h-full flex flex-col justify-between">
        <div class="space-y-3">
          <!-- Icon + title row -->
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl" style="background:rgba(255,255,255,0.05)"></div>
            <div class="flex-1 space-y-2">
              <div class="h-3.5 rounded-lg w-3/4" style="background:rgba(255,255,255,0.06)"></div>
              <div class="h-2.5 rounded-md w-1/2" style="background:rgba(255,255,255,0.04)"></div>
            </div>
          </div>
          <!-- Desc lines -->
          <div class="space-y-1.5">
            <div class="h-2.5 rounded w-full" style="background:rgba(255,255,255,0.04)"></div>
            <div class="h-2.5 rounded w-4/5" style="background:rgba(255,255,255,0.04)"></div>
          </div>
          <!-- Topic chips -->
          <div class="flex gap-1.5">
            <div class="h-5 rounded-md w-14" style="background:rgba(255,255,255,0.04)"></div>
            <div class="h-5 rounded-md w-16" style="background:rgba(255,255,255,0.04)"></div>
            <div class="h-5 rounded-md w-12" style="background:rgba(255,255,255,0.04)"></div>
          </div>
        </div>
        <!-- Footer badges -->
        <div class="space-y-3">
          <div class="flex gap-1.5">
            <div class="h-5 rounded-md w-24" style="background:rgba(255,255,255,0.05)"></div>
            <div class="h-5 rounded-md w-12" style="background:rgba(255,255,255,0.04)"></div>
          </div>
          <div class="flex gap-2 pt-3 border-t" style="border-color:rgba(255,255,255,0.04)">
            <div class="h-6 rounded-lg w-16" style="background:rgba(255,255,255,0.04)"></div>
            <div class="h-6 rounded-lg w-20" style="background:rgba(255,255,255,0.04)"></div>
          </div>
        </div>
      </div>
    </div>`;

    return `
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      ${Array.from({ length: count }, () => card()).join('')}
    </div>`;
  }
}
