{pkgs}: {
  deps = [
    pkgs.realesrgan-ncnn-vulkan
    pkgs.nspr
    pkgs.nss
    pkgs.glib
    pkgs.espeak-ng
    pkgs.unar
    pkgs.unzip
  ];
}
