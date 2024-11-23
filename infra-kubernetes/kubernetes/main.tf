provider "kubernetes" {
  host                   = var.k8s_host
  client_certificate     = file(var.k8s_client_cert)
  client_key             = file(var.k8s_client_key)
  cluster_ca_certificate = file(var.k8s_ca_cert)
}

resource "kubernetes_namespace" "app" {
  metadata {
    name = "fast-food-system"
  }
}
